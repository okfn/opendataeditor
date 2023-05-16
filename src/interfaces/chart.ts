export interface IChart {
  data?: { url?: string; values?: object[] }
  mark?: string | IMark
  encoding?: {
    [type: string]: {
      field?: string
      aggregate?: string
      value?: any
      title?: string
      bin?: boolean | IBin
      axis?: { [type: string]: any }
      sort?: string
      stack?: string
    }
  }
  layers?: object[]
  height?: number
  width?: number
  transform?: ITransform[]
}

// Chart
export interface IMark {
  type: string
  tooltip: boolean
}

// Channel
export interface IBin {
  binned: boolean
  step: number
}

// Transform

export type ITransform = IAggregate | ICalculate | ITbin | IFilter | IStack | IFold

export interface IAggregate {
  title: string
  aggregate: { op: string; field: string; as: string }[]
  groupby: string[]
}

export interface ICalculate {
  title: string
  calculate: { expression: string; as: string }
}

export interface ITbin {
  title: string
  bin: boolean
  field: string
  as: string
}

export interface IStack {
  title: string
  stack: string
  offset: string
  as: string | string[]
  groupby: string[]
  sort: { field: string; order: string }[]
}

export interface IFold {
  title: string
  fold: string[]
}

// Filter

export type IFilter = IParamPredicate | IFieldPredicate | IExpression

export interface IParamPredicate {
  title: string
  filter: { param: string }
}

export interface IFieldPredicate {
  title: string
  filter: { timeUnit: string; field: string; [predicate: string]: string }
}

export interface IExpression {
  title: string
  filter: string
}
