import execa from 'execa'
import { GitHub } from '@actions/github/lib/utils'
import { createPRBody } from './createPRBody'
import { createRelease } from './createRelease'
import { PullRequest } from './interfaces/PullRequest'

export async function updatePR(
  client: InstanceType<typeof GitHub>,
  prNum: number
): Promise<PullRequest> {
  const ghRepo = process.env.GITHUB_REPOSITORY as `${string}/${string}`
  const reponame = ghRepo.split('/', 2)
  const repoPath = process.env.GITHUB_WORKSPACE as string
  await execa('git', ['checkout', 'release'])
  await execa('git', ['pull', 'origin', 'release'])
  await createRelease()
  await execa('git', ['push', 'origin', 'release'])
  const updatedPR = await client.rest.pulls.update({
    owner: reponame[0],
    repo: reponame[1],
    pull_number: prNum,
    body: await createPRBody()
  })
  return updatedPR.data
}
