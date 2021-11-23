import { ISchema } from './schema'
import { IDialect } from './dialect'

export interface IResource {
  path: string
  name: string
  title?: string
  description?: string
  scheme: string
  format: string
  hashing: string
  encoding: string
  dialect: IDialect
  schema: ISchema
  stats: {
    hash: string
    bytes: number
    fields: number
    rows: number
  }
}
