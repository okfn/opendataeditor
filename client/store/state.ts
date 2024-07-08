import type * as types from '@client/types'
import type { ClientError } from '@client/client'
import type { ITableEditor } from '@client/components/Editors/Table'

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
   * A recored desribing currently selected file if any is selected
   **/
  record?: types.IRecord

  /**
   * A `frictionless-py` validation report for the currently selected file if any is selected
   **/
  report?: types.IReport

  /**
   * A measure desribing currently selected file if any is selected
   **/
  measure?: types.IMeasure

  /**
   * True if data is loading
   **/
  loading?: boolean

  /**
   * True if data is indexing
   **/
  indexing?: boolean

  /**
   * Application config object
   **/
  config?: types.IConfig

  /**
   * Currently active event for example, file creation or deletion (to show animation)
   **/
  event?: types.IFileEvent

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
   * A Data Resource descriptor for the current file
   * It can be edited by a metadata editor as a part of metadata adjustment
   * The original `record.resource` is immutable and can be compared
   **/
  resource?: types.IResource

  /**
   * Keeps track of the table state if current file is a table
   **/
  table?: ITableState
}

export type ITableState = {
  /**
   * Optional table mode, e.g. 'errors' to show only errors
   **/
  mode?: 'errors'

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
   * The ref to the Inovua table editor component
   **/
  gridRef?: React.MutableRefObject<ITableEditor>

  /**
   * The source of the table in text format (capped to a certain size, see settings)
   **/
  source?: string

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

export const initialState: IState = {
  files: [],
}
