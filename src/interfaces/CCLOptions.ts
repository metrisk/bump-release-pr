import { Options } from 'conventional-changelog'
import { Context } from 'conventional-changelog-core'
import { Commit } from 'conventional-commits-parser'

export type CCLOptions = Options<Commit<string | number | symbol>, Context>
