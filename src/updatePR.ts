import { GitHub } from '@actions/github/lib/utils'
import git from 'nodegit'
import { createPRBody } from './createPRBody'
import { createRelease } from './createRelease'
import { PullRequest } from './interfaces/PullRequest'

export async function updatePR (
  client: InstanceType<typeof GitHub>,
  prNum: number
): Promise<PullRequest> {
  const ghRepo = process.env.GITHUB_REPOSITORY as `${string}/${string}`
  const reponame = ghRepo.split('/', 2)
  const repoPath = process.env.GITHUB_WORKSPACE as string
  const repository = await git.Repository.open(repoPath)
  const commit = await repository.getMasterCommit()
  await repository.createBranch('release', commit)
  await createRelease()
  const remote = await repository.getRemote('origin')
  await remote.push(['refs/heads/release:refs/heads/release'])
  const updatedPR = await client.rest.pulls.update({
    owner: reponame[0],
    repo: reponame[1],
    pull_number: prNum,
    body: await createPRBody()
  })
  return updatedPR.data
}
