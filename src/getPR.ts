import { PullRequest } from './interfaces/PullRequest'
import { GitHub } from '@actions/github/lib/utils'
import { createPR } from './createPR'

export async function getPR (
  client: InstanceType<typeof GitHub>
): Promise<PullRequest> {
  const ghRepo = process.env.GITHUB_REPOSITORY as `${string}/${string}`
  const reponame = ghRepo.split('/', 2)
  let pr: PullRequest
  const pulls = await client.rest.pulls.list({
    owner: reponame[0],
    repo: reponame[1],
    head: `${reponame[0]}:release`,
    state: 'open'
  })
  if (pulls.data.length > 0) {
    const existingPR = pulls.data[0]
    return existingPR
  } else {
    pr = await createPR(client)
    return pr
  }
}
