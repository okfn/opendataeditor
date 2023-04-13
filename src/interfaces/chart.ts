export interface IChart {
  data?: { url?: string; values?: object[] }
  mark?: string
  encoding?: {
    [type: string]: { field?: string; aggregate?: string; value?: any }
  }
  layers?: object[]
  height?: number
  width?: number
}
