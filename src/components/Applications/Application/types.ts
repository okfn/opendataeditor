import * as React from 'react'

export type IDialog =
  | 'uploadLink'
  | 'createFolder'
  | 'copyFile'
  | 'copyFolder'
  | 'moveFile'
  | 'moveFolder'

export interface IDialogProps {
  title: string
  label: string
  Icon: React.ElementType
}
