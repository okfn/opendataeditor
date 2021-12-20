export interface IInquiry {
  checks?: ICheck[]
  pickErrors?: string[]
  skipErrors?: string[]
  limitErrors?: number
  limitMemory?: number
}

export type ICheck =
  | IDuplicateRowCheck
  | IDeviatedValueCheck
  | ITruncatedValueCheck
  | IForbiddenValueCheck
  | ISequentialValueCheck
  | IRowConstraintCheck
  | ITableDimensionsCheck

export interface IDuplicateRowCheck {
  code: 'duplicate-row'
}

export interface IDeviatedValueCheck {
  code: 'deviated-value'
  fieldName: string
  average?: string
  interval?: number
}

export interface ITruncatedValueCheck {
  code: 'truncated-value'
}

export interface IForbiddenValueCheck {
  code: 'forbidden-value'
  fieldName: string
  values?: any[]
}

export interface ISequentialValueCheck {
  code: 'sequential-value'
  fieldName: string
}

export interface IRowConstraintCheck {
  code: 'row-constraint'
  formula: string
}

export interface ITableDimensionsCheck {
  code: 'table-dimensions'
  numRows?: number
  minRows?: number
  maxRows?: number
  numFields?: number
  minFields?: number
  maxFields?: number
}
