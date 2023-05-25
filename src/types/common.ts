export interface IDict<T extends any = any> {
  [key: string]: T
}
export type IData = IDict
export interface ITreeItem {
  name: string
  path: string
  type: string
  errors?: number
  children: ITreeItem[]
}
