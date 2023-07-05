import * as React from 'react'
import SaveIcon from '@mui/icons-material/Save'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import ConfigEditor from '../../Editors/Config'
import { useStore } from '../store'

export default function ConfigDialog() {
  const updateState = useStore((state) => state.updateState)
  return (
    <ConfirmDialog
      open={true}
      title="Config"
      label="Save"
      maxWidth="md"
      Icon={SaveIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        updateState({ dialog: undefined })
      }}
    >
      <ConfigEditor />
    </ConfirmDialog>
  )
}
