export type IMenuItem = {
  name: string
  section: string
  disabled?: boolean
}

export interface IMenuTreeItem {
  name: string
  section: string
  disabled?: boolean
  children: IMenuTreeItem[]
}
