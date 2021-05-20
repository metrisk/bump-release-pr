import { CommitAuthor } from './CommitAuthor'

export interface CommitInfo {
  author: CommitAuthor
  body?: string
  date: Date
  message: string
  sha: string
  summary: string
}
