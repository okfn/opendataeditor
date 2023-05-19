import { ISchema } from './schema'
import { IDialect } from './dialect'
import { ILicense } from './license'
import { ISource } from './source'
import { IContributor } from './contributor'

export interface IStats {
  errors: number
}

export interface IResourceItem {
  id: string
  path: string
  datatype: string
  errors?: number
}

export interface IResource {
  name: string
  type: string
  title?: string
  description?: string
  licenses?: ILicense[]
  path: string
  scheme?: string
  format?: string
  encoding?: string
  mediatype?: string
  dialect?: IDialect
  schema?: ISchema
  hash?: string
  bytes?: number
  fields?: number
  rows?: number
  sources?: ISource[]
  contributors?: IContributor[]
}
