import * as React from 'react'
import ChatDialog from '../../Base/Dialogs/Chat'
import { useStore } from '../store'

export default function Chat() {
  const edit = useStore((state) => state.edit)
  const updateState = useStore((state) => state.updateState)
  return <ChatDialog onEdit={edit} onClose={() => updateState({ dialog: undefined })} />
}
