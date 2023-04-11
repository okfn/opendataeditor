export interface IChart {
  data?: { url?: string }
  mark?: string
  encoding?: {
    [type: string]: { field?: string; aggregate?: string; value?: any }
  }
  layers?: object[]
  height?: number
  width?: number
}
