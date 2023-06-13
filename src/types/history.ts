import { IDict } from './general'

export interface IChangeIndex {
  header: IDict<IChange>
  label: IDict<IChange>
  row: IDict<IChange>
  cell: IDict<IChange>
}

export interface IHistory {
  changes: IChange[]
}

export type IChange = IRowDelete | ICellUpdate

interface IRowDelete {
  type: 'row-delete'
  rowNumber: number
}

interface ICellUpdate {
  type: 'cell-update'
  rowNumber: number
  fieldName: string
  value: any
}
