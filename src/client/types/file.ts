// If file is indexed it will have name, refined type, and errors
export interface IFile {
  name?: string
  type: string
  path: string
  errors?: number
}

export interface IFileEvent {
  type: 'create' | 'delete' | 'update' | 'locate' | 'open'
  paths: string[]
}

export interface IFileTreeItem {
  name?: string
  type: string
  path: string
  errors?: number
  label: string
  children: IFileTreeItem[]
}
