import sortBy from 'lodash/sortBy'
import cloneDeep from 'lodash/cloneDeep'
import { IFileItem, ITreeItem } from './interfaces'
import * as settings from './settings'

export function exportDescriptor(descriptor: object) {
  const text = encodeURIComponent(JSON.stringify(descriptor, null, 2))
  return `data: text/json;charset=utf-8,${text}`
}

export function getFolderPath(path: string) {
  const parts = path.split('/')
  if (parts.length < 2) return undefined
  return parts.slice(0, -1).join('/')
}

export function createFileTree(items: IFileItem[]): ITreeItem[] {
  let maxLevel = 0

  // Create tree
  const tree: ITreeItem[] = []
  items = cloneDeep(items)
  items = sortBy(items, (item) => !item.isFolder)
  for (const item of items) {
    const parts = item.path.split('/')
    const level = parts.length
    const name = parts[level - 1]
    let type = 'file'
    if (item.isFolder) type = 'folder'
    if (item.path === settings.PACKAGE_PATH) type = 'package'
    maxLevel = Math.max(maxLevel, level)
    tree.push({ name, path: item.path, type, children: [] })
  }

  // Unflatten tree
  while (maxLevel > 1) {
    for (const item of [...tree]) {
      const parts = item.path.split('/')
      const level = parts.length
      if (level === maxLevel) {
        const folder = parts.slice(0, level - 1).join('/')
        const folderItem = tree.find((item: any) => item.path === folder)
        if (folderItem) {
          folderItem.children.push(item)
          tree.splice(tree.indexOf(item), 1)
        }
      }
    }
    maxLevel -= 1
  }

  return tree
}
