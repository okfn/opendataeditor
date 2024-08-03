import LeaveDialog from '../../Base/Dialogs/Leave'
import * as store from '@client/store'

export default function Leave() {
  const onSave = async () => {
    await store.saveTable()
    store.closeDialog()
  }

  const onDiscard = async () => {
    await store.revertTable()
    store.closeDialog()
  }

  return <LeaveDialog onSave={onSave} onDiscard={onDiscard} />
}
