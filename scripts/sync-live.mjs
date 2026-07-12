#!/usr/bin/env node
// Sync local changes to the live site (GitHub Pages).
//
// Usage:
//   node scripts/sync-live.mjs          watch mode: auto commit + push whenever files change
//   node scripts/sync-live.mjs --once   sync current changes once, then exit
//
// Pushing to origin/main triggers .github/workflows/deploy-pages.yml,
// which tests, builds and deploys the site automatically.

import { execFileSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const POLL_MS = 5000
const BRANCH = 'main'
const AUTHOR_NAME = 'Taosusu Store'
const AUTHOR_EMAIL = 'support@taosusu.com'
const LIVE_URL = 'https://susu3494740948-wq.github.io/taosusu/'

function git(...args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}

function gitLoud(...args) {
  execFileSync('git', args, { cwd: repoRoot, stdio: 'inherit' })
}

const timestamp = () => new Date().toLocaleString('sv-SE') // yyyy-mm-dd hh:mm:ss
const log = (message) => console.log(`[sync ${timestamp()}] ${message}`)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function changedFiles() {
  const out = git('status', '--porcelain')
  return out ? out.split('\n') : []
}

function unpushedCount() {
  try {
    return Number(git('rev-list', '--count', `origin/${BRANCH}..HEAD`))
  } catch {
    return 0
  }
}

/** Wait until two consecutive polls see the same working tree, so we never
 *  commit files that are still being written. */
async function waitForStableTree() {
  let prev = git('status', '--porcelain')
  for (;;) {
    await sleep(POLL_MS)
    const next = git('status', '--porcelain')
    if (next === prev) return
    prev = next
  }
}

function commitChanges(files) {
  gitLoud('add', '-A')
  const summary = files.length === 1 ? files[0].slice(3) : `${files.length} files`
  gitLoud(
    '-c', `user.name=${AUTHOR_NAME}`,
    '-c', `user.email=${AUTHOR_EMAIL}`,
    'commit', '-m', `Auto-sync: update ${summary} (${timestamp()})`,
  )
}

function pullRebaseAndPush() {
  try {
    // Picks up commits made on GitHub directly (e.g. in-app cloud sync writes).
    gitLoud('pull', '--rebase', 'origin', BRANCH)
  } catch (error) {
    try {
      git('rebase', '--abort')
    } catch {
      /* no rebase in progress */
    }
    throw error
  }
  gitLoud('push', 'origin', BRANCH)
}

function syncOnce() {
  const files = changedFiles()
  if (files.length > 0) {
    log(`Committing ${files.length} changed file(s)...`)
    commitChanges(files)
  }
  if (unpushedCount() > 0 || files.length > 0) {
    log('Pushing to GitHub...')
    pullRebaseAndPush()
    log(`Pushed. Live site updates in 1-3 minutes: ${LIVE_URL}`)
    return true
  }
  log('Nothing to sync. Local and live are identical.')
  return false
}

async function watch() {
  log(`Watching ${repoRoot}`)
  log(`Any saved change is committed and pushed automatically (checked every ${POLL_MS / 1000}s). Ctrl+C to stop.`)
  for (;;) {
    try {
      if (changedFiles().length > 0) {
        log('Change detected, waiting for files to settle...')
        await waitForStableTree()
        syncOnce()
      } else if (unpushedCount() > 0) {
        log('Found unpushed commits, retrying push...')
        pullRebaseAndPush()
        log(`Pushed. Live site updates in 1-3 minutes: ${LIVE_URL}`)
      }
    } catch (error) {
      log(`Sync failed: ${error.message ?? error}`)
      log('Will retry on the next change. If push keeps failing, check your network/VPN.')
    }
    await sleep(POLL_MS)
  }
}

const once = process.argv.includes('--once')
if (once) {
  try {
    syncOnce()
  } catch (error) {
    log(`Sync failed: ${error.message ?? error}`)
    process.exit(1)
  }
} else {
  watch()
}
