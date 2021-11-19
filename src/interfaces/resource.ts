import { ISchema } from './schema'
import { ILayout, IDialect, IControl } from './features'

export interface IResource {
  path: string
  name: string
  title?: string
  description?: string
  scheme: string
  format: string
  hashing: string
  encoding: string
  control: IControl
  dialect: IDialect
  layout: ILayout
  schema: ISchema
  stats: {
    hash: string
    bytes: number
    fields: number
    rows: number
  }
}
