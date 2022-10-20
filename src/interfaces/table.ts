import { ISchema } from './schema'

export interface ITablePatch {
  [key: number]: IRow
}
export interface ITable {
  schema: ISchema
  header: IHeader
  rows: IRow[]
}
export type IHeader = string[]
export interface IRow {
  [key: string]: any
}
