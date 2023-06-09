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
  const copyFolder = useStore((state) => state.copyFolder)
  const moveFolder = useStore((state) => state.moveFolder)
  const updateState = useStore((state) => state.updateState)
  const dialogInfo = React.useMemo(() => getDialogInfo(dialog), [dialog])
  if (!path) return null
  return (
    <InputDialog
      open={true}
      value={path}
      title={dialogInfo?.title}
      label={dialogInfo?.label}
      Icon={dialogInfo?.Icon}
      placholder="Type a path"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        if (dialog === 'copyFile') {
          await copyFile(path, toPath)
        } else if (dialog === 'copyFolder') {
          await copyFolder(path, toPath)
        } else if (dialog === 'moveFile') {
          await moveFile(path, toPath)
        } else if (dialog === 'moveFolder') {
          await moveFolder(path, toPath)
        }
        updateState({ dialog: undefined })
      }}
    />
  )
}

function getDialogInfo(dialog?: types.IDialog): types.IDialogProps | undefined {
  switch (dialog) {
    case 'copyFile':
      return {
        title: 'Copy File',
        label: 'Copy',
        Icon: ContentCopyIcon,
      }
    case 'copyFolder':
      return {
        title: 'Copy Folder',
        label: 'Copy',
        Icon: ContentCopyIcon,
      }
    case 'moveFile':
      return {
        title: 'Move File',
        label: 'Move',
        Icon: CopyAllIcon,
      }
    case 'moveFolder':
      return {
        title: 'Move Folder',
        label: 'Move',
        Icon: CopyAllIcon,
      }
    default:
      return undefined
  }
}
