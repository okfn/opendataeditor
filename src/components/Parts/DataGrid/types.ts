import * as types from '../../../types'

export interface IErrorIndex {
  header: types.IDict<types.IError[]>
  label: types.IDict<types.IError[]>
  row: types.IDict<types.IError[]>
  cell: types.IDict<types.IError[]>
}

export interface IPatchIndex {
  header: types.IDict<types.ITableChange>
  label: types.IDict<types.ITableChange>
  row: types.IDict<types.ITableChange>
  cell: types.IDict<types.ITableChange>
}
