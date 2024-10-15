import DangerousIcon from '@mui/icons-material/Dangerous'
import TwoButtonDialog from '../../Parts/Dialogs/TwoButton'
import * as store from '@client/store'

export default function UnsavedChangesDialog() {
  const onSave = async () => {
    await store.saveFile()
    store.closeDialog()
  }

  const onDiscard = async () => {
    await store.revertFile()
    store.closeDialog()
  }

  return (
    <TwoButtonDialog
      open={true}
      title="Unsaved Changes"
      cancelLabel="Discard"
      label="Save"
      Icon={DangerousIcon}
      description="There are unsaved changes."
      onCancel={onDiscard}
      onConfirm={onSave}
    />
  )
}
