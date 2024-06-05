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

export type IChange = IRowDelete | ICellUpdate | IMultipleCellUpdate

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
interface ICell {
  rowNumber: number
  fieldName: string
  value: any
}

interface IMultipleCellUpdate {
  type: 'multiple-cells-update'
  cells: ICell[]
}
