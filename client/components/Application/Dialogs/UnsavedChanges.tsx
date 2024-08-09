import DangerousIcon from '@mui/icons-material/Dangerous'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
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
    <ConfirmDialog
      open={true}
      title="Unsaved Changes"
      cancelLabel="Discard"
      label="Save"
      Icon={DangerousIcon}
      description="There are unsaved changes. Please click Save or Discard"
      onCancel={onDiscard}
      onConfirm={onSave}
    />
  )
}
