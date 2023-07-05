import * as React from 'react'
import SaveIcon from '@mui/icons-material/Save'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import ConfigEditor from '../../Editors/Config'
import { useStore } from '../store'

export default function ConfigDialog() {
  const config = useStore((state) => state.config)
  const saveConfig = useStore((state) => state.saveConfig)
  const updateState = useStore((state) => state.updateState)
  const [newConfig, setNewConfig] = React.useState(config)
  if (!newConfig) return null
  return (
    <ConfirmDialog
      open={true}
      title="Config"
      label="Save"
      maxWidth="md"
      Icon={SaveIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        await saveConfig(newConfig)
        updateState({ dialog: undefined })
      }}
    >
      <ConfigEditor config={newConfig} onChange={setNewConfig} />
    </ConfirmDialog>
  )
}
