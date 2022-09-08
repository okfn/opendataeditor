import { ISchema } from './schema'

export interface ITable2 {
  schema: ISchema
  header: IHeader
  rows: IRow[]
}
export interface ITable {
  header: IHeader
  rows: IRow[]
}
export type IHeader = string[]
export interface IRow {
  [key: string]: any
}
export interface ITablePatch {
  [key: number]: IRow
}
