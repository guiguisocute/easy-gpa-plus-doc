// Checks that the reference pages cover the main repository's configuration surface:
// every variable in .env.example and config.go, and every zongce subcommand, must be
// documented; every documented variable must still exist somewhere in the main repo.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsRoot = resolve(fileURLToPath(new URL('..', import.meta.url)), 'docs')

export function envNamesFromExample(text) {
  return new Set([...text.matchAll(/^([A-Z][A-Z0-9_]*)=/gm)].map((m) => m[1]))
}

export function envNamesFromConfig(goSource) {
  const pattern = /\b(?:getenv|Getenv|LookupEnv|intEnv|durationEnv|templateIDsEnv)\("([A-Z][A-Z0-9_]*)"/g
  return new Set([...goSource.matchAll(pattern)].map((m) => m[1]))
}

export function subcommandsFromUsage(goSource) {
  const usage = goSource.match(/const usage = `([\s\S]*?)`/)
  if (!usage) throw new Error('main.go 中找不到 usage 常量')
  return new Set([...usage[1].matchAll(/^[ \t]+([a-z]+(?::[a-z]+)?)[ \t]+\S/gm)].map((m) => m[1]))
}

export function codeTokens(markdown) {
  return new Set([...markdown.matchAll(/`([^`\n]+)`/g)].map((m) => m[1].trim()))
}

export function documentedEnvNames(markdown) {
  return new Set([...codeTokens(markdown)].filter((t) => /^[A-Z][A-Z0-9]*_[A-Z0-9_]+$/.test(t)))
}

export function missing(required, documented) {
  return [...required].filter((name) => !documented.has(name)).sort()
}

const textFile = /\.(?:go|sql|mjs|js|ts|tsx|ya?ml|sh|ps1|toml|json|md|conf|example)$|^(?:Makefile|Dockerfile|\.env\.example)$/
const skipped = new Set(['.git', 'node_modules', 'dist', '.vite', '.ai-eval', 'output', 'tmp'])

export function repoCorpus(root) {
  const parts = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (skipped.has(entry.name)) continue
      const path = join(dir, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (textFile.test(entry.name) && statSync(path).size < 2_000_000) parts.push(readFileSync(path, 'utf8'))
    }
  }
  walk(root)
  return parts.join('\n')
}

export function checkContract(mainRoot) {
  const read = (...p) => readFileSync(join(mainRoot, ...p), 'utf8')
  const envDoc = readFileSync(join(docsRoot, 'reference', 'environment.md'), 'utf8')
  const commandDoc = readFileSync(join(docsRoot, 'reference', 'commands.md'), 'utf8')

  const requiredEnv = new Set([...envNamesFromExample(read('.env.example')), ...envNamesFromConfig(read('backend', 'internal', 'config', 'config.go'))])
  const documentedEnv = documentedEnvNames(envDoc)
  const corpus = repoCorpus(mainRoot)
  const commands = subcommandsFromUsage(read('backend', 'cmd', 'zongce', 'main.go'))

  return {
    undocumentedEnv: missing(requiredEnv, documentedEnv),
    staleEnv: [...documentedEnv].filter((name) => !corpus.includes(name)).sort(),
    undocumentedCommands: missing(commands, codeTokens(commandDoc)),
    counts: { env: requiredEnv.size, commands: commands.size },
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const mainRoot = process.argv[2]
  if (!mainRoot) {
    console.error('用法：node scripts/check-main-contract.mjs /path/to/easy-gpa-plus')
    process.exit(2)
  }
  const result = checkContract(resolve(mainRoot))
  const problems = [
    ...result.undocumentedEnv.map((n) => `环境变量未记录：${n}`),
    ...result.staleEnv.map((n) => `文档中的环境变量在主仓库中已不存在：${n}`),
    ...result.undocumentedCommands.map((n) => `子命令未记录：${n}`),
  ]
  if (problems.length) {
    console.error(problems.join('\n'))
    process.exit(1)
  }
  console.log(`契约通过：${result.counts.env} 个环境变量、${result.counts.commands} 个子命令均已记录。`)
}
