import LeaveDialog from './Dialogs/Leave'
import * as store from '@client/store'

export default function Dialog() {
  const dialog = store.useStore((state) => state.dialog)

  switch (dialog) {
    case 'leaveFile':
      return <LeaveDialog />
    default:
      return null
  }
}
