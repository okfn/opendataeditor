import * as types from '../types'

export function createColumnTree(columns: types.IColumn[]): types.IColumnTreeItem[] {
  const columnTreeMap: { [tableName: string]: types.IColumnTreeItem } = {}
  for (const column of columns) {
    columnTreeMap[column.tableName] = columnTreeMap[column.tableName] || {
      name: column.tableName,
      path: column.tablePath,
      type: 'table',
      children: [],
    }
    columnTreeMap[column.tableName].children.push({
      name: column.name,
      path: `${column.tablePath}/${column.name}`,
      type: column.type,
      children: [],
    })
  }
  const columnTree = Object.values(columnTreeMap)
  return columnTree
}
