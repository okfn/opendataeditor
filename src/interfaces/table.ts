import { ISchema } from './schema'

export interface ITable {
  schema: ISchema
  rows: IRow[]
}
export interface IRow {
  [key: string]: any
}
