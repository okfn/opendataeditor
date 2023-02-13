export interface IDict<T extends any = any> {
  [key: string]: T
}
export type IData = IDict
export interface Icon {
  type: string
  elem: any
}
export interface ITreeItem {
  name: string
  path: string
  type: string
  children: ITreeItem[]
  icon?: Icon
}
