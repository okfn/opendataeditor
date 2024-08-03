import LeaveDialog from '../../Base/Dialogs/Leave'
import * as store from '@client/store'

export default function Leave() {
  const onSave = async () => {
    await store.saveText()
    store.closeDialog()
  }

  const onDiscard = async () => {
    await store.revertText()
    store.closeDialog()
  }

  return <LeaveDialog onSave={onSave} onDiscard={onDiscard} />
}
