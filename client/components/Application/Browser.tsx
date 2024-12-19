import * as store from '@client/store'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { ErrorBoundary } from 'react-error-boundary'
import { Trans, useTranslation } from 'react-i18next'
import createFolderIcon from '../../assets/create_folder_icon.svg'
import SpinnerCard from '../Parts/Cards/Spinner'
import FileTree from '../Parts/Trees/File'

export default function Browser() {
  const files = store.useStore((state) => state.files)
  const loading = store.useStore((state) => state.loading)

  const Browser = loading ? LoadingBrowser : files.length ? DefaultBrowser : EmptyBrowser

  return (
    <Box sx={{ height: '100%' }}>
      <Browser />
    </Box>
  )
}

function DefaultBrowser() {
  const path = store.useStore((state) => state.path)
  const files = store.useStore((state) => state.files)
  const event = store.useStore((state) => state.event)

  const { t } = useTranslation()

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ color: '#555' }}>
          <Trans i18nKey="failed-open-project" components={{ 1: <strong /> }} />{' '}
          <a href="https://github.com/okfn/opendataeditor/issues" target="_blank">
            {t('create-an-issue')}
          </a>{' '}
          <Trans
            i18nKey="sharing-contents-if-possible"
            components={{ 1: <small>(if possible)</small> }}
          />
        </Box>
      }
    >
      <Button
        color="OKFNCoolGray"
        sx={{ textTransform: 'none', marginLeft: '20px', justifyContent: 'flex-start' }}
        startIcon={<img src={createFolderIcon} alt="" />}
        onClick={() => store.openDialog('addEmptyFolder')}
      >
        {t('create-folder')}
      </Button>
      <FileTree
        files={files}
        event={event}
        selected={path}
        onSelect={(path) => store.selectFile({ path })}
      />
    </ErrorBoundary>
  )
}

function EmptyBrowser() {
  return <Box />
}

function LoadingBrowser() {
  const { t } = useTranslation()
  return <SpinnerCard message={t('loading')} />
}
