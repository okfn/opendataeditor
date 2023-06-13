import * as React from 'react'
import UploadIcon from '@mui/icons-material/Upload'
import InputDialog from '../../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function UploadLinkDialog() {
  const fetchLink = useStore((state) => state.fetchLink)
  const updateState = useStore((state) => state.updateState)
  return (
    <InputDialog
      open={true}
      title="Upload Link"
      label="Upload"
      Icon={UploadIcon}
      description="You are uploading a link. Enter source:"
      placholder="Enter or paste a URL"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (url) => {
        await fetchLink(url)
        updateState({ dialog: undefined })
      }}
    />
  )
}
