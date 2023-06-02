export interface IFile {
  type: string
  path: string
  indexed?: boolean
  errorCount?: number
}

export interface IFileEvent {
  type: 'create' | 'delete' | 'update'
  paths: string[]
}

export interface IFileTreeItem {
  name: string
  path: string
  type: string
  indexed?: boolean
  errorCount?: number
  children: IFileTreeItem[]
}
