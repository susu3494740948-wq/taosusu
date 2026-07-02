export const githubRepoConfig = {
  owner: 'susu3494740948-wq',
  repo: 'taosusu',
  branch: 'main',
} as const

export type CloudFetchResult<T> = { ok: true; data: T } | { ok: false; data: null }

function utf8ToBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

export function getCloudJsonUrls(repoPath: string): string[] {
  const publicPath = repoPath.replace(/^public\//, '')
  const base = import.meta.env.BASE_URL
  return [
    `${base}${publicPath}`,
    `https://raw.githubusercontent.com/${githubRepoConfig.owner}/${githubRepoConfig.repo}/${githubRepoConfig.branch}/${repoPath}`,
  ]
}

export async function fetchCloudJson<T>(repoPath: string): Promise<CloudFetchResult<T>> {
  for (const url of getCloudJsonUrls(repoPath)) {
    try {
      const response = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' })
      if (!response.ok) continue
      const data = (await response.json()) as T
      return { ok: true, data }
    } catch {
      continue
    }
  }
  return { ok: false, data: null }
}

export async function syncJsonToGitHub(
  repoPath: string,
  payload: unknown,
  token: string,
  commitMessage: string,
): Promise<void> {
  const trimmedToken = token.trim()
  if (!trimmedToken) {
    throw new Error('Missing GitHub sync token')
  }

  const apiUrl = `https://api.github.com/repos/${githubRepoConfig.owner}/${githubRepoConfig.repo}/contents/${repoPath}`
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${trimmedToken}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }

  let sha: string | undefined
  const existing = await fetch(apiUrl, { headers })
  if (existing.ok) {
    const body = (await existing.json()) as { sha?: string }
    sha = body.sha
  } else if (existing.status !== 404) {
    throw new Error(`GitHub read failed (${existing.status})`)
  }

  const content = utf8ToBase64(JSON.stringify(payload, null, 2))
  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      content,
      sha,
      branch: githubRepoConfig.branch,
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub sync failed (${response.status})`)
  }
}

export function canSyncToCloud(token: string | undefined): boolean {
  return Boolean(token?.trim())
}
