import { IDict } from './common'

export interface IChangeIndex {
  header: IDict<IChange>
  label: IDict<IChange>
  row: IDict<IChange>
  cell: IDict<IChange>
}

export interface IHistory {
  changes: IChange[]
}

export type IChange = IDeleteRow | IUpdateCell

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
