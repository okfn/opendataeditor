import * as React from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import LinearProgress from '@mui/material/LinearProgress'
import CheckIcon from '@mui/icons-material/Check'
import ConfirmDialog from '../../../Parts/Dialogs/Confirm'
import PortalEditor from '../../../Editors/Portal'
import * as helpers from '../../../../helpers'
import * as types from '../../../../types'

export interface PublishDialogProps {
  onPublish: (control: types.IControl) => Promise<string>
  onClose: () => void
}

export default function PublishDialog(props: PublishDialogProps) {
  const [portal, setPortal] = React.useState<types.IPortal>({ type: 'ckan' })
  const [control, setControl] = React.useState<types.IControl>()
  const [isPublishing, setIsPublishing] = React.useState(false)
  const [publishedUrl, setPublishedUrl] = React.useState<string | undefined>()
  const handleClose = () => props.onClose()
  const handlePublish = async () => {
    if (!control) return
    setIsPublishing(true)
    const url = await props.onPublish(control)
    setIsPublishing(false)
    setPublishedUrl(url)
  }
  return (
    <ConfirmDialog
      open={true}
      disabled={!control}
      maxWidth="md"
      title="Publish Dataset"
      label={publishedUrl ? 'OK' : 'Publish'}
      Icon={CheckIcon}
      onCancel={handleClose}
      onConfirm={publishedUrl ? handleClose : handlePublish}
    >
      <Box sx={{ marginLeft: -2, paddingBottom: 2 }}>
        <PortalEditor
          portal={portal}
          onChange={(portal) => {
            setPortal(portal)
            setControl(helpers.makeControl(portal))
          }}
        />
      </Box>
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
