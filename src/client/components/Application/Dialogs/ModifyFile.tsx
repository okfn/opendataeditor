import * as React from 'react'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function ModifyFileDialog() {
  const fetchFile = useStore((state) => state.fetchFile)
  const updateState = useStore((state) => state.updateState)
  return (
    <InputDialog
      open={true}
      title="Adjust File"
      label="Adjust"
      Icon={DisplaySettingsIcon}
      description="You are fetching a file. Enter source:"
      placholder="Enter or paste a URL"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (url) => {
        await fetchFile(url)
        updateState({ dialog: undefined })
      }}
    />
  )
}
