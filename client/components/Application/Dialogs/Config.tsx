import * as React from 'react'
import Box from '@mui/material/Box'
import SaveIcon from '@mui/icons-material/Save'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import ConfigEditor from '../../Editors/Config'
import * as store from '@client/store'

export default function ConfigDialog() {
  const config = store.useStore((state) => state.config)
  const dialog = store.useStore((state) => state.dialog)

  const [newConfig, setNewConfig] = React.useState(config)
  if (!newConfig) return null

  return (
    <ConfirmDialog
      open={true}
      title="Config"
      label="Save"
      maxWidth="md"
      Icon={SaveIcon}
      onCancel={store.closeDialog}
      onConfirm={async () => {
        await store.saveConfig(newConfig)
        store.closeDialog()
      }}
    >
      <Box sx={{ marginLeft: -2 }}>
        <ConfigEditor
          config={newConfig}
          onChange={setNewConfig}
          defaultSection={dialog === 'configProject' ? 'project' : undefined}
        />
      </Box>
    </ConfirmDialog>
  )
}
