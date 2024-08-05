import type * as types from '@client/types'
import type { ClientError } from '@client/client'

export type IState = {
  /**
   * The list of files in the current project
   **/
  files: types.IFile[]

  /**
   * A path of the currently selected file if any is selected
   **/
  path?: string

  /**
   * Keeps track of the selected multiple files/folders paths for deletion
   **/
  selectedMultiplePaths?: string[]

  /**
   * A recored desribing currently selected file if any is selected
   **/
  record?: types.IRecord

  /**
   * A `frictionless-py` validation report for the currently selected file if any is selected
   **/
  report?: types.IReport

  /**
   * A Data Resource descriptor for the current file
   * It can be edited by a metadata editor as a part of metadata adjustment
   * The original `record.resource` is immutable and can be compared
   **/
  resource?: types.IResource

  /**
   * True if data is loading (for example a list of files in the Browser)
   **/
  loading?: boolean

  /**
   * True if data is indexing (for example a tabular data validation and database uploading).
   * Note that it's different with loading as it's about the data in the Content component.
   **/
  indexing?: boolean

  /**
   * Application config object
   **/
  config?: types.IConfig

  /**
   * Currently active event for example, file creation or deletion (to show animation)
   **/
  event?: types.IEvent

  /**
   * Keeps track of the current error (global to the app)
   **/
  error?: ClientError

  /**
   * Keeps track of the displayed dialog
   **/
  dialog?: IDialog

  /**
   * Keeps track of the selected panel
   **/
  panel?: IPanel

  /**
   * File source as text or binary data depending on the file format
   * It will be loaded only if it makes sense for this file
   **/
  source?: ISource

  /**
   * Keeps track of the table state if current file is a table
   **/
  table?: ITableState

  /**
   * Keeps track of the text state if current file is a text
   **/
  text?: ITextState
}

export type ITableState = {
  /**
   * The number of rows in the table
   **/
  rowCount: number

  /**
   * The history object that includes all the changes done to the current table
   * The application merged these changes into the table editor via table loader
   **/
  history: types.IHistory

  /**
   * The same as history but for reverted changes
   **/
  undoneHistory: types.IHistory

  /**
   * Optional table mode, e.g. 'errors' to show only errors
   **/
  mode?: 'errors'

  /**
   * Keeps track of the URL where the table was published as a dataset (e.g. to CKAN)
   **/
  publishedUrl?: string

  /**
   * When the table is in the in-edit mode keeps track of the initial cell value
   **/
  initialEditingValue?: string | number

  /**
   * Keeps track of the current table selection in the Inovua table editor
   **/
  selection?: types.ITableSelection
}

export type ITextState = {
  /**
   * Text content for the text editor
   **/
  contents: string

  /**
   * Text versions for undo/redo functionality
   **/
  minimalVersion: number
  currentVersion: number
  maximalVersion: number
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
  | 'publish'
  | 'chat'
  | 'leaveFile'

export type IPanel = 'metadata' | 'report' | 'changes' | 'source'

export type ISource = {
  bytes?: ArrayBuffer
  text?: string
}

export const initialState: IState = {
  files: [],
}
