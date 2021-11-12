import { IError } from './error'
import { IResource } from './resource'

export interface IReport {
  version: string
  time: number
  valid: boolean
  stats: { errors: number; tasks: number }
  errors: IError[]
  tasks: IReportTask[]
}

export interface IReportTask {
  resource: IResource
  time: number
  valid: boolean
  scope: string[]
  partial: boolean
  stats: { errors: number }
  errors: IError[]
}

export interface IReportError {
  count: number
  code: string
  name: string
  tags: string[]
  description: string
  messages: string[]
  header: string[]
  data: {
    [rowPosition: number]: {
      values: any[]
      errors: Set<number>
    }
  }
}
