import type { TypeCellSelection } from '@inovua/reactdatagrid-community/types'

export type ICellSelection = NonNullable<TypeCellSelection>

export interface ITable {
  header: IHeader
  rows: IRow[]
}

export type IHeader = string[]
export interface IRow {
  [key: string]: any
}

export type ITableLoader = (props: {
  skip: number
  limit: number
  sortInfo: any
}) => Promise<{
  data: object[]
  count: number
}>

export interface ITableSelection {
  rowNumber?: number
  columnName?: string
}
