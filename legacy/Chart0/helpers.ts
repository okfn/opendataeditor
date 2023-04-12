import { ITreeItem, IFieldItem } from '../../../interfaces'

export function createTreeFromFields(fields: IFieldItem[]): ITreeItem[] {
  const fieldTreeMap: { [tableName: string]: ITreeItem } = {}
  for (const item of fields) {
    fieldTreeMap[item.tableName] = fieldTreeMap[item.tableName] || {
      name: item.tableName,
      path: item.tablePath,
      type: 'table',
      children: [],
    }
    fieldTreeMap[item.tableName].children.push({
      name: item.name,
      path: `${item.tablePath}/${item.name}`,
      type: item.type,
      children: [],
    })
  }
  const fieldTree = Object.values(fieldTreeMap)
  return fieldTree
}
