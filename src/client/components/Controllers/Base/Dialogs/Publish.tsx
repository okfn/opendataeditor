import * as React from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import LinearProgress from '@mui/material/LinearProgress'
import CheckIcon from '@mui/icons-material/Check'
import ConfirmDialog from '../../../Parts/Dialogs/Confirm'
import ControlEditor from '../../../Editors/Control'
import * as helpers from '../../../../helpers'
import * as types from '../../../../types'

export interface PublishDialogProps {
  onPublish: (control: types.IControl) => Promise<string>
  onClose: () => void
}

export default function PublishDialog(props: PublishDialogProps) {
  const [control, setControl] = React.useState<Partial<types.IControl> | undefined>()
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [publishedUrl, setPublishedUrl] = React.useState<string | undefined>()
  const ensuredControl = helpers.ensureControl(control)
  const handleClose = () => props.onClose()
  const handlePublish = async () => {
    if (!ensuredControl) return
    setIsPublishing(true)
    const url = await props.onPublish(ensuredControl)
    setIsPublishing(false)
    setPublishedUrl(url)
  }
  return (
    <ConfirmDialog
      open={true}
      disabled={!ensuredControl}
      maxWidth="md"
      title="Publish Dataset"
      label={publishedUrl ? 'OK' : 'Publish'}
      Icon={CheckIcon}
      onCancel={handleClose}
      onConfirm={publishedUrl ? handleClose : handlePublish}
    >
      <ControlEditor control={control} onChange={setControl} />
      {isPublishing && (
        <Box sx={{ borderTop: 'solid 1px #ddd', padding: 2 }}>
          Publishing
          <LinearProgress />
        </Box>
      )}
      {!!publishedUrl && (
        <Box sx={{ borderTop: 'solid 1px #ddd', padding: 2 }}>
          Published:{' '}
          <Link href={publishedUrl} target="_blank">
            {publishedUrl}
          </Link>
        </Box>
      )}
    </ConfirmDialog>
  )
}
