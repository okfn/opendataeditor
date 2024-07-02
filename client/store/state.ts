import type * as types from '@client/types'
import type { ClientError } from '@client/client'
import type { ITableEditor } from '@client/components/Editors/Table'

export const initialState: IState = {
  files: [],
}

export type IState = {
  path?: string
  config?: types.IConfig
  record?: types.IRecord
  measure?: types.IMeasure
  resource?: types.IResource
  files: types.IFile[]
  fileEvent?: types.IFileEvent
  error?: ClientError
  loading?: boolean
  indexing?: boolean
  table?: ITableState

  /**
   * Keeps track of the displayed dialog
   **/
  dialog?: IDialog

  /**
   * Keeps track of the selected panel
   **/
  panel?: IPanel
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
  | 'deleteFile'
  | 'deleteFolder'
  | 'indexFiles'
  | 'moveFile'
  | 'moveFolder'
  | 'start'
  | 'publish'
  | 'saveAs'
  | 'chat'
  | 'leave'

export type IPanel = 'metadata' | 'report' | 'changes' | 'source'

export type ITableState = {
  rowCount: number
  history: types.IHistory
  undoneHistory: types.IHistory
  gridRef?: React.MutableRefObject<ITableEditor>
  source?: string
  publishedUrl?: string
}
