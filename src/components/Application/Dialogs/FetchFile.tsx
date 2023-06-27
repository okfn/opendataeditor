import * as React from 'react'
import UploadIcon from '@mui/icons-material/Upload'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function FetchFileDialog() {
  const fetchFile = useStore((state) => state.fetchFile)
  const updateState = useStore((state) => state.updateState)
  return (
    <InputDialog
      open={true}
      title="Fetch File"
      label="Fetch"
      Icon={UploadIcon}
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
