import { ISchema } from './schema'

export type ITableLoader = (props: {
  skip: number
  limit: number
  sortInfo: any
}) => Promise<{
  data: object[]
  count: number
}>

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
