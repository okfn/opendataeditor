import DangerousIcon from '@mui/icons-material/Dangerous'
import TwoButtonDialog from '../../Parts/Dialogs/TwoButton'
import * as store from '@client/store'

export default function CloseWithUnsavedChangesDialog() {
  const onSave = async () => {
    await store.saveFile()
    store.closeDesktopApp()
  }

  const onDiscard = async () => {
    await store.revertFile()
    store.closeDesktopApp()
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
      disableClosing={true}
    />
  )
}
