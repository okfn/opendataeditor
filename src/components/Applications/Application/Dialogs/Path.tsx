import * as React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import InputDialog from '../../../Parts/Dialogs/Input'
import { useStore } from '../store'
import * as types from '../types'

export default function PathDialog() {
  const path = useStore((state) => state.path)
  const dialog = useStore((state) => state.dialog)
  const copyFile = useStore((state) => state.copyFile)
  const moveFile = useStore((state) => state.moveFile)
  const updateState = useStore((state) => state.updateState)
  const dialogInfo = React.useMemo(() => getDialogInfo(dialog), [dialog])
  if (!path) return null
  return (
    <InputDialog
      value={path}
      title={dialogInfo?.title}
      label={dialogInfo?.label}
      Icon={dialogInfo?.Icon}
      open={!!dialog && dialog.startsWith('path/')}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        if (dialog === 'path/copy/file') {
          await copyFile(path, toPath)
        } else if (dialog === 'path/copy/folder') {
          await copyFile(path, toPath)
        } else if (dialog === 'path/move/file') {
          await moveFile(path, toPath)
        } else if (dialog === 'path/move/folder') {
          await moveFile(path, toPath)
        }
        updateState({ dialog: undefined })
      }}
    />
  )
}

function getDialogInfo(dialog?: types.IDialog): types.IDialogProps | undefined {
  switch (dialog) {
    case 'path/copy/file':
      return {
        title: 'Copy File',
        label: 'Copy',
        Icon: ContentCopyIcon,
      }
    case 'path/copy/folder':
      return {
        title: 'Copy Folder',
        label: 'Copy',
        Icon: ContentCopyIcon,
      }
    case 'path/move/file':
      return {
        title: 'Move File',
        label: 'Move',
        Icon: CopyAllIcon,
      }
    case 'path/move/folder':
      return {
        title: 'Move Folder',
        label: 'Move',
        Icon: CopyAllIcon,
      }
    default:
      return undefined
  }
}
