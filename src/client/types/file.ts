export interface IFile {
  name?: string
  type: string
  path: string
  indexed?: boolean
  errorCount?: number
}

export interface IFileEvent {
  type: 'create' | 'delete' | 'update' | 'locate' | 'open'
  paths: string[]
}

export interface IFileTreeItem {
  name: string
  type: string
  path: string
  indexed?: boolean
  errorCount?: number
  children: IFileTreeItem[]
}
