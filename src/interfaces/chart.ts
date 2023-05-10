export interface IChart {
  data?: { url?: string; values?: object[] }
  mark?: string
  encoding?: {
    [type: string]: { field?: string; aggregate?: string; value?: any }
  }
  layers?: object[]
  height?: number
  width?: number
  transform?: ITransform[]
}

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
