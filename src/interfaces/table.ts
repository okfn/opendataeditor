export interface ITable {
  header: IHeader
  rows: IRow[]
}
export type IHeader = string[]
export interface IRow {
  [key: string]: any
}
