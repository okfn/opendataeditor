export interface ISchema {
  fields: IField[]
  missingValues: string[]
  primaryKey?: string[]
}

export interface IField {
  name: string
  type: string
  format: string
}
