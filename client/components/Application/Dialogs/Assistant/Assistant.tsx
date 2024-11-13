import TwoButtonDialog from '@client/components/Parts/Dialogs/TwoButton'
import * as appStore from '@client/store'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'

export function AssistantDialog() {
  return (
    <TwoButtonDialog
      open={true}
      maxWidth="md"
      title="AI Assistant"
      Icon={AutoFixHighIcon}
      cancelLabel="Cancel"
      onCancel={appStore.closeDialog}
      onConfirm={console.log}
    >
      If you proceed, the Open Data Editor will only share the names of the columns in
      your table to suggest improvements to the titles and descriptions associated with
      them. Do you want to proceed?
    </TwoButtonDialog>
  )
}
