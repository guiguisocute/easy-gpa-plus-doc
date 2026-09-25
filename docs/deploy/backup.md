# 备份与恢复

`worker:backup` 每天备份 PostgreSQL 与对象存储，并在随机命名的临时数据库中执行恢复演练，确认备份确实能恢复。备份计划、保留期、演练结果和异地目标都在运维台「备份与恢复」查看和配置。

## 本机两份

| 目录 | 容器内路径 | 来源 |
| --- | --- | --- |
| 本地备份 | `/backups/local` | 命名卷 `backupdata` |
| 离机备份 | `/backups/offsite` | `BACKUP_OFFSITE_VOLUME`，留空时为命名卷 `backupoffsite` |

`APP_ENV=prod` 时，API 和备份 Worker 要求这两个目录都存在且不同。离机目录应挂载到**独立的存储**上，例如另一块磁盘或网络存储：

```sh
# .env
BACKUP_OFFSITE_VOLUME=/mnt/offsite/easygpa
```

本机的两份用于恢复演练和快速回滚，按 `BACKUP_RETENTION_DAYS`（默认 30 天，范围 1—3650）清理。目录被移走或删除时，备份目录会如实标记为失败，不会假装仍可恢复。

## 异地加密副本

还可以把每份本地备份加密后推送到任意 S3 兼容的云存储桶，作为真正的异地副本。

1. 生成一对 [age](https://age-encryption.org/) 密钥，**私钥离线保管**，不要放到服务器上：

   ```sh
   age-keygen -o backup-identity.txt   # 输出中的 age1... 为公钥
   ```

2. 在 `.env` 中设置：

   ```sh
   BACKUP_REMOTE_RECIPIENT=age1...                # 只填公钥
   BACKUP_REMOTE_SECRET_KEY=<openssl rand -hex 32>  # 加密运维页保存的桶凭据
   ```

   如果误把 `AGE-SECRET-KEY-` 开头的私钥填进 `BACKUP_REMOTE_RECIPIENT`，进程会拒绝启动。

3. 在运维台「备份与恢复」填写桶的地址、名称与 AccessKey/SecretKey，并设置远程保留期。

推送的工作方式：

- 每份备份打包为 `tar → gzip → age` 一条流边加密边上传，磁盘上不会多出第二份；
- 上传后比对大小，并回读首尾各 1 MiB 核对指纹，以发现截断和传错对象。这只证明上传完整，不等于整包可恢复；
- 桶上的清单只含不敏感的元信息，对象列表都在加密包内；
- 远程保留期与本地独立，只清理符合本系统命名的对象，不会碰桶里的其他文件；
- 首次开启时只推送最近 24 小时内完成的备份，历史副本需要手动补推；
- 远程推送是独立任务，失败时自行重试，不会把一次成功的本地备份判为失败。

服务器即使被攻破，攻击者也只能写入新备份，读不到任何历史备份。

## 恢复

每份异地副本在桶中是一个 `backup-<ID>/` 前缀，内含 `archive.tar.gz.age` 与不敏感的 `manifest.json`。恢复时先用离线保管的 age 私钥解密：

```sh
age -d -i backup-identity.txt archive.tar.gz.age | tar -xz
```

解出的目录与本机 `/backups/local/backup-<ID>/` 的结构相同。

恢复前停止 API 与各 Worker，备份当前数据库，再按解出的内容恢复 PostgreSQL 与对象存储。建议定期整包拉回一份做完整演练，与系统每日的自动演练互补。

::: warning 保管好三样东西
age 私钥、`.env`（尤其是 `AI_CONFIG_SECRET_KEY`、`MAIL_SECRET_KEY` 与 `BACKUP_REMOTE_SECRET_KEY`）以及 Garage 配置。缺少这些密钥，数据库里加密保存的凭据无法解开。
:::
