export interface IDialect {
  name?: string
  title?: string
  description?: string
  header?: boolean
  headerRows?: number[]
  headerJoin?: string
  headerCase?: boolean
  commentChar?: string
  commentRows?: number[]
  csv?: ICsvControl
  excel?: IExcelControl
  json?: IJsonControl
}

export interface ICsvControl {
  delimiter?: string
  lineTerminator?: string
  quoteChar?: string
  doubleQuote?: boolean
  escapeChar?: string
  nullSequence?: string
  skipInitialSpace?: boolean
}

export interface IExcelControl {
  sheet?: string | number
  fillMergedCells?: boolean
  preserveFormatting?: boolean
  adjustFloatingPointError: boolean
}

export interface IJsonControl {
  keys?: string[]
  keyed?: boolean
  property?: string
}
