import * as types from '../types'

export function createFieldTree(columns: types.IColumn[]): types.ITreeItem[] {
  const fieldTreeMap: { [tableName: string]: types.ITreeItem } = {}
  for (const column of columns) {
    fieldTreeMap[column.tableName] = fieldTreeMap[column.tableName] || {
      name: column.tableName,
      path: column.tablePath,
      type: 'table',
      children: [],
    }
    fieldTreeMap[column.tableName].children.push({
      name: column.name,
      path: `${column.tablePath}/${column.name}`,
      type: column.type,
      children: [],
    })
  }
  const fieldTree = Object.values(fieldTreeMap)
  return fieldTree
}
