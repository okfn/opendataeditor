import { IDict } from './general'
import { IError } from './error'

export interface IReport {
  valid: boolean
  stats: { tasks: number; errors: number; warnings: number; seconds: number }
  warnings: string[]
  errors: IError[]
  tasks: IReportTask[]
}

export interface IReportTask {
  valid: boolean
  name: string
  type: string
  place: string
  labels: string[]
  stats: { errors: number; warnings: number; seconds: number }
  errors: IError[]
}

export interface IErrorIndex {
  header: IDict<IError[]>
  label: IDict<IError[]>
  row: IDict<IError[]>
  cell: IDict<IError[]>
}
