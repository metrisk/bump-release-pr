import standardVersion from 'standard-version'

export async function createRelease (): Promise<boolean> {
  const workspace = process.env.GITHUB_WORKSPACE as string
  await standardVersion({
    noVerify: true,
    infile: `${workspace}/CHANGELOG.md`,
    silent: true,
    skip: {
      tag: true
    }
  })
  return true
}
