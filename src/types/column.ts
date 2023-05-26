export type IColumn = {
  name: string
  type: string
  tableName: string
  tablePath: string
}

// TODO: remove in favour of IColumn, columnTree etc
export type IFieldItem = IColumn
