export interface ISchema {
  fields: IField[]
  missingValues: string[]
  primaryKey?: string[]
  // TODO: remove string support
  foreignKeys?: string | object[]
}

export interface IField {
  name: string
  type: string
  format: string
}
