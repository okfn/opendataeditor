import * as React from 'react'
import UploadIcon from '@mui/icons-material/Upload'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function AddRemoteDatasetDialog() {
  const fetchFile = useStore((state) => state.fetchFile)
  const updateState = useStore((state) => state.updateState)
  return (
    <InputDialog
      open={true}
      title="Add Remote Dataset"
      label="Fetch"
      Icon={UploadIcon}
      description="You can add a Ckan, Github, or Zenodo dataset link:"
      placholder="Enter or paste an URL"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (url) => {
        await fetchFile(url)
        updateState({ dialog: undefined })
      }}
    />
  )
}
