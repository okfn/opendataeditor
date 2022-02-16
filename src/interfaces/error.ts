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
  cell?: any
}

export interface IHeaderError extends IError {}

export interface IRowError extends IError {}
