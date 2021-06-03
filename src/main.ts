import * as core from '@actions/core'
import github from '@actions/github'
import { getPR } from './getPR'

async function run(): Promise<void> {
  core.info("I AM HERE!")
  const token = process.env.GITHUB_TOKEN
  const repoPath = process.env.GITHUB_WORKSPACE
  if (typeof token === 'undefined' || typeof repoPath === 'undefined') {
    core.setFailed(
      `Environment variable GITHUB_${typeof token !== 'undefined' ? 'WORKSPACE' : 'TOKEN'
      } is required`
    )
    return
  }
  const repository = process.env.GITHUB_REPOSITORY as `${string}/${string}`
  const octokit = github.getOctokit(token)
  try {
    const pr = await getPR(octokit)
    core.info(`PR:${pr.number} has the lastest release info`)
    return
  } catch (err) {
    core.setFailed(err)
    return
  }
}

run()
