import { IDict } from './common'
import { IResource } from './resource'

export interface IChangeIndex {
  header: IDict<IChange>
  label: IDict<IChange>
  row: IDict<IChange>
  cell: IDict<IChange>
}

export interface IHistory {
  changes: IChange[]
}

export type IChange = IDeleteRow | IUpdateCell | IUpdateResource

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

interface IUpdateResource {
  type: 'update-resource'
  resource: IResource
}
