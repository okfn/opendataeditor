import { ISchema } from './schema'
import { IDialect } from './dialect'
import { IChecklist } from './checklist'
import { IPipeline } from './pipeline'

export interface IResource {
  name: string
  title?: string
  description?: string
  type: string
  path: string
  scheme: string
  format: string
  encoding: string
  mediatype: string
  dialect: IDialect
  schema: ISchema
  checklist: IChecklist
  pipeline: IPipeline
  stats: {
    md5: string
    sha256: string
    bytes: number
    fields: number
    rows: number
  }
}
