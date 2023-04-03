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
  ods?: IOdsControl
  html?: IHtmlControl
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
  workBookCache?: string
  fillMergedCells?: boolean
  preserveFormatting?: boolean
  adjustFloatingPointError?: boolean
  stringified?: boolean
}

export interface IJsonControl {
  keys?: string[]
  keyed?: boolean
  property?: string
}

export interface IOdsControl {
  sheet?: string | number
}

export interface IHtmlControl {
  selector?: string
}
