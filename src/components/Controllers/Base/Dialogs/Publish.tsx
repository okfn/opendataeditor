import * as React from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import LinearProgress from '@mui/material/LinearProgress'
import CheckIcon from '@mui/icons-material/Check'
import ConfirmDialog from '../../../Parts/Dialogs/Confirm'
import ControlEditor from '../../../Editors/Control'
import * as types from '../../../../types'

export interface PublishDialogProps {
  onPublish: (control: types.IControl) => Promise<string>
  onClose: () => void
}

export default function PublishDialog(props: PublishDialogProps) {
  const [control, setControl] = React.useState<types.IControl | undefined>()
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [publishedPath, setPublishedPath] = React.useState<string | undefined>()
  const handleClose = () => props.onClose()
  const handlePublish = async () => {
    if (!control) return
    setIsPublishing(true)
    const path = await props.onPublish(control)
    setIsPublishing(false)
    setPublishedPath(path)
  }
  return (
    <ConfirmDialog
      open={true}
      disabled={!control}
      title="Publish Dataset"
      label={publishedPath ? 'OK' : 'Publish'}
      Icon={CheckIcon}
      onCancel={handleClose}
      onConfirm={publishedPath ? handleClose : handlePublish}
    >
      <ControlEditor control={control} onChange={setControl} />
      {isPublishing && (
        <Box sx={{ borderTop: 'solid 1px #ddd', padding: 2 }}>
          Publishing
          <LinearProgress />
        </Box>
      )}
      {!!publishedPath && (
        <Box sx={{ borderTop: 'solid 1px #ddd', padding: 2 }}>
          Published:{' '}
          <Link href={publishedPath} target="_blank">
            {publishedPath}
          </Link>
        </Box>
      )}
    </ConfirmDialog>
  )
}
