import { IDict } from './common'

export interface ISchema {
  fields: IField[]
  primaryKey?: string[]
  foreignKeys?: IForeignKey[]
  missingValues: string[]
}

export interface IField {
  name: string
  type: string
  format: string
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
  field: string[]
  reference: {
    field: string[]
    resource: string
  }
}
