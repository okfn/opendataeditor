// TODO: rework using ICsvDialctMixin/etc

export interface IDialect {
  header?: boolean
  headerRows?: number[]
  headerJoin?: string
  headerCase?: boolean
  delimiter?: string
  lineTerminator?: string
  quoteChar?: string
  doubleQuote?: boolean
  escapeChar?: string
  nullSequence?: string
  skipInitialSpace?: boolean
  commentChar?: string
}
