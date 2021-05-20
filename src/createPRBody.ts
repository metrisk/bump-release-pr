import conventionalChangelog from 'conventional-changelog'
import ccConfig from 'conventional-changelog-metrisk'
import { Commit } from 'conventional-commits-parser'
import semverRegex from 'semver-regex'

import { CCLOptions } from './interfaces/CCLOptions'

export async function createPRBody(): Promise<string> {
  const repoPath = process.env.GITHUB_WORKSPACE as string
  const options: CCLOptions = {
    config: ccConfig,
    releaseCount: 1,
    pkg: {
      path: `${repoPath}/package.json`
    },
    transform: (chunk: Commit<string | number | symbol>, cb) => {
      if (typeof chunk.gitTags === 'string') {
        const tags = chunk.gitTags.match(semverRegex()) ?? []
        if (tags.length > 0) {
          chunk.version = tags[0]
        }
      }

      cb(null, chunk)
    }
  }
  const chunks = []
  const stream = conventionalChangelog(options)
  for await (const chunk of stream) {
    chunks.push(chunk)
  }

  const buffer = Buffer.concat(chunks)
  const body = buffer.toString('utf-8')
  return body
}
