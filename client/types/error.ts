export interface IError {
  type: string
  title: string
  description: string
  message: string
  tags: string[]
  rowNumber?: number
  fieldNumber?: number
  fieldName?: string
  labels?: string[]
  label?: string
  cells?: string[]
  cell?: any
}

export interface IHeaderError extends IError {}
export interface IRowError extends IError {}
