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
  rdfType?: string
}

export interface IForeignKey {
  name?: string
  field: string[]
}
