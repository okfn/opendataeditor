import sortBy from 'lodash/sortBy'
import cloneDeep from 'lodash/cloneDeep'
import { IFileItem, ITreeItem, IHelp, IHelpItem } from './interfaces'
import * as settings from './settings'

export function readHelpItem(help: IHelp, path: string): IHelpItem | null {
  const record = help[path]
  if (!record) return null
  return { path, title: record[0], link: record[1], description: record[2] }
}

// TODO: cloneDeep here?
export function getInitialDescriptor(type?: string) {
  switch (type) {
    case 'package':
      return settings.INITIAL_PACKAGE
    case 'resource':
      return settings.INITIAL_RESOURCE
    case 'dialect':
      return settings.INITIAL_DIALECT
    case 'schema':
      return settings.INITIAL_SCHEMA
    default:
      return undefined
  }
}

export function bytesToBase64(bytes: ArrayBuffer): string {
  return btoa(
    new Uint8Array(bytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
}

export function exportDescriptor(descriptor: object) {
  const text = encodeURIComponent(JSON.stringify(descriptor, null, 2))
  return `data: text/json;charset=utf-8,${text}`
}

export function getFolderPath(path: string) {
  const parts = path.split('/')
  if (parts.length < 2) return undefined
  return parts.slice(0, -1).join('/')
}

export function createFileTree(items: IFileItem[], types?: string[]): ITreeItem[] {
  let maxLevel = 0

  // Create tree
  const tree: ITreeItem[] = []
  items = cloneDeep(items)
  items = sortBy(items, (item) => item.type !== 'folder')
  for (const item of items) {
    if (types && !types.includes(item.type)) continue
    const parts = item.path.split('/')
    const level = parts.length
    const name = parts[level - 1]
    maxLevel = Math.max(maxLevel, level)
    tree.push({
      name,
      path: item.path,
      type: item.type,
      children: [],
      errors: item.errorCount ?? undefined,
    })
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

export function getFolderList(file: File) {
  const folders = file.webkitRelativePath ? file.webkitRelativePath.split('/') : []
  const folderList = folders
    ? folders.reduce(function (filtered: { [key: string]: any }[], _, index: number) {
        const item = folders.slice(0, index + 1)
        if (item.length > 1) {
          const name = item.slice(-1).join()
          filtered.push({
            name: name,
            folder: item.slice(0, -1).join('/'),
            type: name === file.name ? 'file' : 'folder',
            file: name === file.name ? file : '',
          })
        }
        return filtered
      }, [])
    : []
  return folderList
}

export function genTitle(items: any[], suffix: string = '') {
  let i = 0
  let exists = true
  let title: string
  while (true) {
    title = `${suffix}${i}`
    exists =
      items.filter((item) => item.title === title || item.name === title).length > 0
    if (!exists) break
    i++
  }
  return title
}
