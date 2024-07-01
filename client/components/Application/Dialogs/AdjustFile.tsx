import * as React from 'react'
import Box from '@mui/material/Box'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import SelectField from '../../Parts/Fields/Select'
import InputField from '../../Parts/Fields/Input'
import * as store from '@client/store'
import * as settings from '../../../settings'

export default function AdjustFileDialog() {
  const record = store.useStore((state) => state.record)
  const [name, setName] = React.useState(record?.name || '')
  const [type, setType] = React.useState(record?.type || '')
  if (!record) return null

  const newName = record.name !== name ? name : undefined
  const newType = record.type !== type ? type : undefined

  return (
    <ConfirmDialog
      disabled={!newName && !newType}
      open={true}
      title="Adjust File"
      label="Adjust"
      Icon={DisplaySettingsIcon}
      description="You can change file name and type. Currently they are:"
      onCancel={store.closeDialog}
      onConfirm={async () => {
        await store.adjustFile(newName, newType)
        store.closeDialog()
      }}
    >
      <Box sx={{ marginTop: -1 }}>
        <InputField autoFocus label="Name" value={name} onChange={setName} />
        <SelectField
          label="Type"
          value={type}
          options={settings.FILE_TYPES}
          onChange={setType}
        />
      </Box>
    </ConfirmDialog>
  )
}
