import * as React from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import LinearProgress from '@mui/material/LinearProgress'
import CheckIcon from '@mui/icons-material/Check'
import ConfirmDialog from '../../../Parts/Dialogs/Confirm'
import PortalEditor from '../../../Editors/Portal'
import * as helpers from '../../../../helpers'
import * as types from '../../../../types'

type IState = 'form' | 'load' | 'done' | 'fail'

export interface PublishDialogProps {
  onClose: () => void
  onPublish: (control: types.IControl) => Promise<string | undefined>
  onPublishNote?: string
}

export default function PublishDialog(props: PublishDialogProps) {
  const [portal, setPortal] = React.useState<types.IPortal>({ type: 'ckan' })
  const [control, setControl] = React.useState<types.IControl>()
  const [state, setState] = React.useState<IState>('form')
  const [publishedUrl, setPublishedUrl] = React.useState<string | undefined>()

  const handleClose = () => props.onClose()
  const handlePublish = async () => {
    if (!control) return
    setState('load')
    const url = await props.onPublish(control)
    setState('done')
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
      {state === 'load' && (
        <Box sx={{ borderTop: 'solid 1px #ddd', padding: 2 }}>
          Publishing
          <LinearProgress />
        </Box>
      )}
      {state === 'done' && (
        <Box sx={{ borderTop: 'solid 1px #ddd', padding: 2 }}>
          Published:{' '}
          <Link href={publishedUrl} target="_blank">
            {publishedUrl}
          </Link>{' '}
          {props.onPublishNote && <small> ({props.onPublishNote})</small>}
        </Box>
      )}
    </ConfirmDialog>
  )
}
