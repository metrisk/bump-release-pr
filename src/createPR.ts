import { GitHub } from '@actions/github/lib/utils'
import git from 'nodegit'
import { createPRBody } from './createPRBody'
import { createRelease } from './createRelease'
import { PullRequest } from './interfaces/PullRequest'

/**
 * Creates a pull request on Github
 *
 * @async
 * @param {InstanceType<typeof GitHub>} client - Github/Octokit client
 * @return {Promise<PullRequest>} [Full PullRequest object](https://docs.github.com/en/rest/reference/pulls#create-a-pull-request)
 */
export async function createPR (
  client: InstanceType<typeof GitHub>
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
  const createdPR = await client.rest.pulls.create({
    owner: reponame[0],
    repo: reponame[1],
    base: 'main',
    head: 'release',
    body: await createPRBody()
  })
  return createdPR.data
}
