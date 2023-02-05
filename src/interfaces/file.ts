import { IResource } from './resource'
import { IReport } from './report'

export interface IFileItem {
  path: string
  type: string
  updated: string
  tableName?: string
}

export interface IFile extends IFileItem {
  resource: IResource
  report: IReport
}
