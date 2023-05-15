export interface IChart {
  data?: { url?: string; values?: object[] }
  mark?: string
  encoding?: {
    [type: string]: {
      field?: string
      aggregate?: string
      value?: any
      title?: string
      bin?: boolean | IBin
      axis?: { [type: string]: any }
    }
  }
  layers?: object[]
  height?: number
  width?: number
  transform?: ITransform[]
}

// Transform

export interface ITransform {
  [key: string]: any
}

export interface IAggregate extends ITransform {
  title: string
  aggregate: { op: string; field: string; as: string }[]
  groupby: string[]
}

export interface ICalculate extends ITransform {
  title: string
  calculate: { expression: string; as: string }
}

export interface ITbin extends ITransform {
  bin: boolean
  field: string
  as: string
}

// Filter

export interface IFilter extends ITransform {
  [key: string]: any
}

export interface IParamPredicate extends IFilter {
  title: string
  filter: { param: string }
}

export interface IFieldPredicate extends IFilter {
  title: string
  filter: { timeUnit: string; field: string; [predicate: string]: string }
}

export interface IExpression extends IFilter {
  title: string
  filter: string
}

// Bin
export interface IBin {
  binned: boolean
  step: number
}
