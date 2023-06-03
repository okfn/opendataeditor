import * as React from 'react'

export type IDialog =
  | 'link/create'
  | 'name/create/folder'
  | 'path/copy/file'
  | 'path/copy/folder'
  | 'path/move/file'
  | 'path/move/folder'

export interface IDialogProps {
  title: string
  label: string
  Icon: React.ElementType
}
