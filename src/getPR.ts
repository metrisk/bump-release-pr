import * as core from '@actions/core'
import { PullRequest } from './interfaces/PullRequest'
import { GitHub } from '@actions/github/lib/utils'
import { createPR } from './createPR'
import { updatePR } from './updatePR'

export async function getPR(
  client: InstanceType<typeof GitHub>
): Promise<PullRequest> {
  const ghRepo = process.env.GITHUB_REPOSITORY as `${string}/${string}`
  const reponame = ghRepo.split('/', 2)
  let pr: PullRequest
  core.info('Getting PRs')
  const pulls = await client.rest.pulls.list({
    owner: reponame[0],
    repo: reponame[1],
    head: `${reponame[0]}:release`,
    state: 'open'
  })
  if (pulls.data.length > 0) {
    core.info('There is an existing PR')
    const existingPR = pulls.data[0]
    const updatedPR = updatePR(client, existingPR.number)
    return updatedPR
  } else {
    core.info('There is no existing PR, creating one')
    pr = await createPR(client)
    return pr
  }
}
