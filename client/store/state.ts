import type * as types from '@client/types'
import type { ClientError } from '@client/client'

export const initialState: IState = {
  files: [],
}

export type IState = {
  path?: string
  config?: types.IConfig
  record?: types.IRecord
  measure?: types.IMeasure
  files: types.IFile[]
  fileEvent?: types.IFileEvent
  selectedMultiplePaths?: string[]
  error?: ClientError
  dialog?: IDialog
  loading?: boolean
  indexing?: boolean
}

export type IDialog =
  | 'addEmptyFolder'
  | 'addRemoteFile'
  | 'adjustFile'
  | 'config'
  | 'configProject'
  | 'copyFile'
  | 'copyFolder'
  | 'create'
  | 'deleteFilesFolders'
  | 'indexFiles'
  | 'moveFile'
  | 'moveFolder'
  | 'start'
