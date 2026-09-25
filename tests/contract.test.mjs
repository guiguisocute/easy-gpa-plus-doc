import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  codeTokens,
  documentedEnvNames,
  envNamesFromConfig,
  envNamesFromExample,
  missing,
  subcommandsFromUsage,
} from '../scripts/check-main-contract.mjs'

test('reads assignments from .env.example and ignores comments', () => {
  const names = envNamesFromExample('# APP_ENV=prod\nAPP_ENV=dev\nHTTP_ADDR=:8080\n  INDENTED=1\nlower=1\n')
  assert.deepEqual([...names].sort(), ['APP_ENV', 'HTTP_ADDR'])
})

test('reads every env helper used by config.go', () => {
  const source = `
    AppEnv: getenv("APP_ENV", "dev"),
    Redis: os.Getenv("REDIS_PASSWORD"),
    c.TTL, err = durationEnv("ACCESS_TOKEN_TTL", 15*time.Minute)
    c.Days, err = intEnv("BACKUP_RETENTION_DAYS", 30)
    c.IDs, err = templateIDsEnv("TENCENTCLOUD_SES_TEMPLATE_IDS")
    msg := "APP_ENV 只能是 dev 或 prod"`
  assert.deepEqual([...envNamesFromConfig(source)].sort(), [
    'ACCESS_TOKEN_TTL', 'APP_ENV', 'BACKUP_RETENTION_DAYS', 'REDIS_PASSWORD', 'TENCENTCLOUD_SES_TEMPLATE_IDS',
  ])
})

test('reads subcommands from the zongce usage text, including tab-indented rows', () => {
  const source = 'const usage = `用法: zongce <子命令>\n\n  api               HTTP API 服务\n\tworker:maintenance 定时提醒\n\tworker:backup      每日备份\n  migrate:down       回退\n`\nfunc main() {}'
  assert.deepEqual([...subcommandsFromUsage(source)].sort(), ['api', 'migrate:down', 'worker:backup', 'worker:maintenance'])
})

test('treats only backticked upper-case names as documented variables', () => {
  const markdown = '| `APP_ENV` | `dev` |\n| `JWT_SECRET` | 至少 32 字节 |\nPlain APP_ENV and `app_env` do not count; `DEV` has no underscore.'
  assert.deepEqual([...documentedEnvNames(markdown)].sort(), ['APP_ENV', 'JWT_SECRET'])
  assert.ok(codeTokens(markdown).has('dev'))
})

test('reports names that are required but not documented', () => {
  assert.deepEqual(missing(new Set(['B', 'A', 'C']), new Set(['A'])), ['B', 'C'])
})

test('the environment reference documents every variable the commands page mentions', () => {
  const env = documentedEnvNames(readFileSync(new URL('../docs/reference/environment.md', import.meta.url), 'utf8'))
  const commands = documentedEnvNames(readFileSync(new URL('../docs/reference/commands.md', import.meta.url), 'utf8'))
  assert.deepEqual(missing(commands, env), [])
})
