export type IMenuItem = {
  name: string
  section: string
}

export interface IMenuTreeItem {
  name: string
  section: string
  children: IMenuTreeItem[]
}
