import git from 'nodegit'
import { CommitInfo } from './interfaces/CommitInfo'

export async function getCommitInfo (branch: string): Promise<CommitInfo> {
  const repository = await git.Repository.open('./')
  const commit = await repository.getBranchCommit(branch)
  return {
    author: {
      name: commit.author().name(),
      email: commit.author().email(),
      string: commit.author().toString()
    },
    body: commit.body(),
    date: commit.date(),
    message: commit.message(),
    sha: commit.sha(),
    summary: commit.summary()
  }
}
