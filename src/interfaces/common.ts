export interface IDict<T extends any = any> {
  [key: string]: T
}
export interface ITreeItem {
  name: string
  path: string
  type: string
  children: ITreeItem[]
}
