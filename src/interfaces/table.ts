export interface ITable {
  header: IHeader
  rows: IRow[]
}

export type ITableLoader = (props: {
  skip: number
  limit: number
  sortInfo: any
}) => Promise<{
  data: object[]
  count: number
}>

export interface ITablePatch {
  [key: number]: IRow
}

export type IHeader = string[]
export interface IRow {
  [key: string]: any
}
