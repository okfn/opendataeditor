import ChatDialog from '../../Base/Dialogs/Chat'
import { useStore } from '../store'
import * as store from '@client/store'

export default function Chat() {
  const edit = useStore((state) => state.edit)
  const type = useStore((state) => state.record?.type)
  if (!type) return null

  return <ChatDialog type={type} onEdit={edit} onClose={store.closeDialog} />
}
