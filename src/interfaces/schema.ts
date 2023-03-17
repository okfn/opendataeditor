import { IDict } from './common'

export interface ISchema {
  name?: string
  title?: string
  description?: string
  fields: IField[]
  primaryKey?: string[]
  foreignKeys?: IForeignKey[]
  missingValues?: string[]
}

export type IFieldItem = {
  name: string
  type: string
  tableName: string
  tablePath: string
}

export interface IField {
  name: string
  type: string
  format?: string
  title?: string
  description?: string
  missingValues?: string[]
  // TODO: improve type
  constraints?: { [key: string]: any }
  rdfType?: string
  arrayItem?: IDict
  trueValues?: string[]
  falseValues?: string[]
  bareNumber?: boolean
  floatNumber?: boolean
  decimalChar?: string
  groupChar?: string
}

export interface IForeignKey {
  fields: string[]
  reference: {
    fields: string[]
    resource: string
  }
}
