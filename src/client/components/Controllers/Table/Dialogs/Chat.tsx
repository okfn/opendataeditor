import * as React from 'react'
import ChatDialog from '../../Base/Dialogs/Chat'
import { useStore } from '../store'

export default function Chat() {
  const edit = useStore((state) => state.edit)
  const type = useStore((state) => state.record?.type)
  const updateState = useStore((state) => state.updateState)
  if (!type) return null
  return (
    <ChatDialog
      type={type}
      onEdit={edit}
      onClose={() => updateState({ dialog: undefined })}
    />
  )
}
