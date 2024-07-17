import LeaveDialog from '../../Base/Dialogs/Leave'
import * as store from '@client/store'

export default function Leave() {
  return <LeaveDialog onClose={store.closeDialog} />
}
