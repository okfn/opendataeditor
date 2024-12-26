import * as store from '@client/store'
import CheckIcon from '@mui/icons-material/Check'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Link from '@mui/material/Link'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import * as helpers from '../../../helpers'
import * as types from '../../../types'
import PortalEditor from '../../Editors/Portal'
import OneButtonDialog from '../../Parts/Dialogs/OneButton'

type IState = 'form' | 'load' | 'done' | 'fail'

export default function PublishDialog() {
  const [portal, setPortal] = React.useState<types.IPortal>({ type: 'ckan' })
  const [control, setControl] = React.useState<types.IControl>()
  const [state, setState] = React.useState<IState>('form')
  const [publishedUrl, setPublishedUrl] = React.useState<string | undefined>()
  const record = store.useStore((state) => state.record)
  if (record?.type !== 'table') return null

  const handleClose = () => store.closeDialog()
  const handlePublish = async () => {
    if (!control) return
    setState('load')
    const url = await store.publishTable(control)
    setState('done')
    setPublishedUrl(url)
  }

  const { t } = useTranslation()

  return (
    <OneButtonDialog
      open={true}
      disabled={!control}
      maxWidth="md"
      title={t('publish-dataset')}
      label={publishedUrl ? t('ok') : t('publish')}
      Icon={CheckIcon}
      onCancel={handleClose}
      onConfirm={publishedUrl ? handleClose : handlePublish}
    >
      <Box sx={{ padding: '24px' }}>
        <PortalEditor
          portal={portal}
          onChange={(portal) => {
            console.log('portal', portal)
            setPortal(portal)
            setControl(helpers.makeControl(portal))
          }}
        />
      </Box>
      {state === 'load' && (
        <Box sx={{ borderTop: 'solid 1px #ddd', padding: 2 }}>
          {t('uploading')}
          <LinearProgress />
        </Box>
      )}
      {state === 'done' && (
        <Box sx={{ borderTop: 'solid 1px #ddd', padding: 2 }}>
          {t('uploaded')}:{' '}
          <Link href={publishedUrl} target="_blank">
            {publishedUrl}
          </Link>{' '}
        </Box>
      )}
    </OneButtonDialog>
  )
}
