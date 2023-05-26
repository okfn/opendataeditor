import { IDict } from './common'

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

export interface IChangeIndex {
  header: IDict<ITableChange>
  label: IDict<ITableChange>
  row: IDict<ITableChange>
  cell: IDict<ITableChange>
}

export interface ITablePatch {
  changes: ITableChange[]
}

export type ITableChange = IDeleteRow | IUpdateCell

interface IDeleteRow {
  type: 'delete-row'
  rowNumber: number
}

interface IUpdateCell {
  type: 'update-cell'
  rowNumber: number
  fieldName: string
  value: any
}
