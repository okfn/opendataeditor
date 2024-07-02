import ChatDialog from './Dialogs/Chat'
import LeaveDialog from './Dialogs/Leave'
import PublishDialog from './Dialogs/Publish'
import SaveAsDialog from './Dialogs/SaveAs'
import * as store from '@client/store'

export default function Dialog() {
  const dialog = store.useStore((state) => state.dialog)

  switch (dialog) {
    case 'chat':
      return <ChatDialog />
    case 'leave':
      return <LeaveDialog />
    case 'publish':
      return <PublishDialog />
    case 'saveAs':
      return <SaveAsDialog />
    default:
      return null
  }
}
