import { IError, IDict, ITableChange } from '../../../interfaces'

export interface IErrorIndex {
  header: IDict<IError[]>
  label: IDict<IError[]>
  row: IDict<IError[]>
  cell: IDict<IError[]>
}

export interface IPatchIndex {
  header: IDict<ITableChange>
  label: IDict<ITableChange>
  row: IDict<ITableChange>
  cell: IDict<ITableChange>
}
