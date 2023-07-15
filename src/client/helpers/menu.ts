import cloneDeep from 'lodash/cloneDeep'
import * as types from '../types'

export function createMenuTree(menuItems: types.IMenuItem[]): types.IMenuTreeItem[] {
  let maxLevel = 0

  // Create tree
  const tree: types.IMenuTreeItem[] = []
  menuItems = cloneDeep(menuItems)
  for (const menuItem of menuItems) {
    const parts = menuItem.section.split('/')
    const level = parts.length
    const name = parts[level - 1]
    maxLevel = Math.max(maxLevel, level)
    tree.push({
      name: menuItem.name || name,
      section: menuItem.section,
      disabled: menuItem.disabled,
      children: [],
    })
  }

  // Unflatten tree
  while (maxLevel > 1) {
    for (const item of [...tree]) {
      const parts = item.section.split('/')
      const level = parts.length
      if (level === maxLevel) {
        const folder = parts.slice(0, level - 1).join('/')
        const folderItem = tree.find((item) => item.section === folder)
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
