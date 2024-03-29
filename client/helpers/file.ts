import sortBy from 'lodash/sortBy'
import cloneDeep from 'lodash/cloneDeep'
import * as types from '../types'

export function createFileTree(
  files: types.IFile[],
  types?: string[]
): types.IFileTreeItem[] {
  let maxLevel = 0

  // Create tree
  const tree: types.IFileTreeItem[] = []
  files = cloneDeep(files)
  files = sortBy(files, (file) => file.type !== 'folder')
  for (const file of files) {
    if (types && !types.includes(file.type)) continue
    const parts = file.path.split('/')
    const level = parts.length
    const label = parts[level - 1]
    maxLevel = Math.max(maxLevel, level)
    tree.push({
      name: file.name,
      type: file.type,
      path: file.path,
      label,
      errors: file.errors,
      children: [],
    })
  }

  // Unflatten tree
  while (maxLevel > 1) {
    for (const item of [...tree]) {
      const parts = item.path.split('/')
      const level = parts.length
      if (level === maxLevel) {
        const folder = parts.slice(0, level - 1).join('/')
        const folderItem = tree.find((item) => item.path === folder)
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

export function listParentFolders(paths: string[], folders: string[] = []) {
  for (const path of paths) {
    const folder = path.split('/').slice(0, -1).join('/')
    if (!folder) continue
    if (!folders.includes(folder)) folders.push(folder)
    listParentFolders([folder], folders)
  }
  return folders
}
