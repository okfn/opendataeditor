import * as appStore from '@client/store'
import Dialog from '@mui/material/Dialog'

export function AssistantDialog() {
  return (
    <Dialog
      fullWidth
      open={true}
      aria-labelledby="AI"
      aria-describedby="AI Assistant"
      onClose={appStore.closeDialog}
    >
      AI Assistant
    </Dialog>
  )
}
