import ChatDialog from '../../Base/Dialogs/Chat'
import * as store from '@client/store'

export default function Chat() {
  const type = store.useStore((state) => state.record?.type)
  if (!type) return null

  return <ChatDialog type={type} onEdit={store.editTable} onClose={store.closeDialog} />
}
