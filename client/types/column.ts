export type IColumn = {
  name: string
  type: string
  tableName: string
  tablePath: string
}

export interface IColumnTreeItem {
  name: string
  path: string
  type: string
  children: IColumnTreeItem[]
}
