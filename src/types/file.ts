export interface IFile {
  type: string
  path: string
  errors?: number
}

export interface IFileEvent {
  type: 'create' | 'delete' | 'draft' | 'update'
  paths: string[]
}