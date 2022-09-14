import { IResource } from './resource'
import { IReport } from './report'

export interface IRecord {
  name: string
  type: string
  updated: number
  resource: IResource
  report: IReport
}
