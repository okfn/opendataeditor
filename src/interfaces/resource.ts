import { ISchema } from './schema'

export interface IResource {
  path: string
  name: string
  title?: string
  description?: string
  scheme: string
  format: string
  hashing: string
  encoding: string
  schema: ISchema
  stats: {
    hash: string
    bytes: number
    fields: number
    rows: number
  }
}
