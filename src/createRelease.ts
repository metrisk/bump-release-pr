import * as core from '@actions/core'
import standardVersion from 'standard-version'

export async function createRelease(): Promise<boolean> {
  core.info('Creating release...')
  const workspace = process.env.GITHUB_WORKSPACE as string
  try {
    await standardVersion({
      noVerify: true,
      infile: `${workspace}/CHANGELOG.md`,
      silent: false,
      skip: {
        tag: true
      }
    })
  } catch (err) {
    core.error('failing to create release')
    core.error(err)

    return false
  }
  return true
}
