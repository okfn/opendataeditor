import { ISchema } from './schema'

export interface ITable {
  tableSchema: ISchema
  header: IHeader
  rows: IRow[]
}
export interface ITablePatch {
  [key: number]: IRow
}
export interface IQueryData {
  header: string[]
  rows: IRow[]
}
export type IHeader = string[]
export interface IRow {
  [key: string]: any
}
