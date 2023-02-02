import { IResource } from './resource'
import { IReport } from './report'

export interface IListedRecord {
  path: string
  type: string
  updated: string
  tableName?: string
}

export interface IRecord extends IListedRecord {
  resource: IResource
  report: IReport
}
