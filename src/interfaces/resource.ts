import { ISchema } from './schema'
import { IDialect } from './dialect'
import { IChecklist } from './checklist'
import { IPipeline } from './pipeline'
import { IReport } from './report'

export interface IResourceListItem {
  path: string
  updated: string
  tableName: string
}

export interface IResourceItem extends IResourceListItem {
  resource: IResource
  report: IReport
}

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
  pipeline?: IPipeline
  stats?: {
    md5: string
    sha256: string
    bytes: number
    fields: number
    rows: number
  }
}
