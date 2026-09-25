# 邮件通知

邮件是可选能力，用于验证码、找回密码和业务通知。目前提供腾讯云 SES `SendEmail` API 通道，不使用 SMTP。部署者需要自行验证发信域名并申请模板，仓库不附带可用的发信账号。

## 需要申请的模板

| 模板 | 用途 |
| --- | --- |
| `verification_code` | 邮箱验证码 |
| `password_reset` | 找回密码 |
| `mail_test` | 运维自检 |
| `notification_alert` | 合并短时间内的重要通知 |
| `notification_digest` | 每日汇总 |

前三个是认证与自检所需；两个通知模板在业务邮件暂停期间可以暂不填写，不影响验证码和找回密码。

模板 HTML 位于主仓库 `asset/mailtemplate/`。两份通知模板使用 `name`、`class_name`、`heading`、`summary`、`details`、`view`、`opt_out_token`、`sent_at`、`preference_note` 这些变量。请保留占位符和退订链接；正文不发送具体分数、学生材料或匿名审核身份。

仓库 HTML 中的 `https://gpa.example.org` 是占位地址，本地渲染时由 `PUBLIC_URL` 替换。上传到 SES 控制台的副本必须先替换成自己的 HTTPS 站点地址，并使用固定域名链接，不要让变量提供整个 URL。应用内的源模板保留占位地址，供运行时替换与校验。

目录中其他 HTML 与旧模板键只为兼容历史记录保留，对应的旧发送路径已停用，新部署无需申请。

## 配置

推荐做法：在 `.env` 中只设置 `MAIL_SECRET_KEY`（32 字节，`openssl rand -hex 32`），其余在运维台「邮件与通知」填写：SecretId/SecretKey、地域、认证与通知的发信地址、发件人名称、回复地址和全部模板 ID。凭据由 `MAIL_SECRET_KEY` 加密后存入数据库。

完成自检后再启用。业务邮件默认处于暂停状态，暂停期间产生的事件不会在恢复后补发。

`.env` 中的 `TENCENTCLOUD_*` 变量只用于没有运维库的精简部署或应急回退；一旦开始填写，就必须形成完整、独立的配置。`TENCENTCLOUD_SES_REGION` 只能是 `ap-guangzhou` 或 `ap-hongkong`。变量说明见[环境变量](/reference/environment#邮件)。

## 用户侧设置

用户在「账号设置」中按分类选择通知、设置每日汇总、静默与限额，也可以通过邮件中的退订链接退订，这些设置在任何发送路径上都生效。

当前流程是单项独立审核、分歧裁定、实时成绩与问题处理：学生核对当前版本不阻塞结算，也不取消申诉权。因此没有整表终审、定时确认或确认催办邮件。
