import { ISchema } from './schema'
import { IDialect } from './dialect'
import { IChecklist } from './checklist'

export interface IResource {
  name: string
  type: string
  title?: string
  description?: string
  path: string
  scheme: string
  format: string
  encoding: string
  mediatype: string
  dialect?: IDialect
  schema?: ISchema
  checklist?: IChecklist
  // TODO: remove
  stats?: {
    md5: string
    sha256: string
    bytes: number
    fields: number
    rows: number
  }
}
