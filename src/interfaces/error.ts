// TODO: improve type system

export interface IError {
  code: string
  name: string
  tags: string[]
  message: string
  description: string
  rowPosition?: number
  fieldPosition?: number
  labels?: string[]
  cells?: string[]
}

export interface IHeaderError extends IError {}

export interface IRowError extends IError {}
