import LeaveDialog from './Dialogs/Leave'
import PublishDialog from './Dialogs/Publish'
import * as store from '@client/store'

export default function Dialog() {
  const dialog = store.useStore((state) => state.dialog)

  switch (dialog) {
    case 'leave':
      return <LeaveDialog />
    case 'publish':
      return <PublishDialog />
    default:
      return null
  }
}
