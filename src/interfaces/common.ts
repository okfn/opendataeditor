export type ISession = string | null
export interface IDict<T extends any = any> {
  [key: string]: T
}
export interface IFileItem {
  path: string
  isFolder: boolean
}
export interface ITreeItem {
  name: string
  path: string
  type: string
  children: ITreeItem[]
}
