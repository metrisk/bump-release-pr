import * as core from '@actions/core'
import execa from 'execa'
import { GitHub } from '@actions/github/lib/utils'
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
export async function createPR(
  client: InstanceType<typeof GitHub>
): Promise<PullRequest> {
  const ghRepo = process.env.GITHUB_REPOSITORY as `${string}/${string}`
  const reponame = ghRepo.split('/', 2)
  // const repoPath = process.env.GITHUB_WORKSPACE as string
  // await execa('cd', [repoPath])
  core.info('Creating release branch')
  await execa('git', ['checkout', '-b', 'release'])
  core.info('Creating Release')
  await createRelease()
  await execa('git', ['push', 'origin', 'release'])
  const createdPR = await client.rest.pulls.create({
    owner: reponame[0],
    repo: reponame[1],
    base: 'main',
    head: 'release',
    body: await createPRBody(),
    title: 'RELEASE'
  })
  return createdPR.data
}
