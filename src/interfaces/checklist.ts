export interface IChecklist {
  name?: string
  title?: string
  description?: string
  checks?: ICheck[]
  pickErrors?: string[]
  skipErrors?: string[]
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
  type: 'duplicate-row'
}

export interface IDeviatedValueCheck {
  type: 'deviated-value'
  fieldName: string
  average?: string
  interval?: number
}

export interface ITruncatedValueCheck {
  type: 'truncated-value'
}

export interface IForbiddenValueCheck {
  type: 'forbidden-value'
  fieldName: string
  values?: any[]
}

export interface ISequentialValueCheck {
  type: 'sequential-value'
  fieldName: string
}

export interface IRowConstraintCheck {
  type: 'row-constraint'
  formula: string
}

export interface ITableDimensionsCheck {
  type: 'table-dimensions'
  numRows?: number
  minRows?: number
  maxRows?: number
  numFields?: number
  minFields?: number
  maxFields?: number
}
