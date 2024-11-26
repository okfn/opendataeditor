import * as store from '@client/store'
import { ClickAwayListener } from '@mui/base'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import emptyContentScreenImg from '../../assets/empty_screen.png'
import File from '../Controllers/File'
import Table from '../Controllers/Table'
import Text from '../Controllers/Text'
import SpinnerCard from '../Parts/Cards/Spinner'
import { useTranslation, Trans } from 'react-i18next'

export default function Content() {
  const record = store.useStore((state) => state.record)
  const indexing = store.useStore((state) => state.indexing)
  const path = store.useStore((state) => state.path)

  return indexing ? (
    <LoadingContent />
  ) : record && path ? (
    <FileContent />
  ) : (
    <EmptyContent />
  )
}

function FileContent() {
  const record = store.useStore((state) => state.record)
  const dialog = store.useStore((state) => state.dialog)
  if (!record) return null

  const Controller = CONTROLLERS[record.type] || File
  const { t } = useTranslation()

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ padding: 2.5, color: '#555' }}>
          <strong>Failed to open the file</strong>. Please{' '}
          <a href="https://github.com/okfn/opendataeditor/issues" target="_blank">
            {t('create-an-issue')}
          </a>{' '}
          <Trans i18nKey="sharing-contents-if-possible" components={{ 1: <small /> }} />
        </Box>
      }
    >
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={(event) => {
          // Generally speaking, it will be better to migrate away
          // from using ClickAwayListener for this purpose. See this weird bug:
          // https://github.com/okfn/opendataeditor/issues/559
          // As alternative, store's actions just check for unsaved changes
          // when the user does something that requires it.
          if (dialog) return

          event.preventDefault()
          store.onFileLeave()
        }}
      >
        <Box>
          <Controller />
        </Box>
      </ClickAwayListener>
    </ErrorBoundary>
  )
}

function EmptyContent() {
  const { t } = useTranslation()
  return (
    <StyledCard>
      <StyledCardContent>
        <Box sx={{}}>
          <img src={emptyContentScreenImg} alt="Empty Content Screen" />
        </Box>
        <Typography
          sx={{
            fontWeight: 600,
            color: '#52595A',
            fontSize: 14,
            paddingBottom: '8px',
          }}
        >
          {t('ODE-supports-CSV-Excel-files')}
        </Typography>
        <Button
          sx={{
            my: 0.5,
            width: '236px',
            textTransform: 'none',
            backgroundColor: (theme) => theme.palette.OKFNBlack.main,
            '&:hover': {
              backgroundColor: (theme) => theme.palette.OKFNBlue.main,
            },
          }}
          variant="contained"
          aria-label="accept"
          onClick={() => store.openDialog('fileUpload')}
        >
          {t('upload-your-data')}
        </Button>
        <Typography
          sx={{
            paddingTop: '8px',
            fontWeight: 500,
            color: '#6B7380',
            fontSize: '12px',
          }}
        >
          {t('links-online-tables')}
        </Typography>
      </StyledCardContent>
    </StyledCard>
  )
}

function LoadingContent() {
  return <SpinnerCard message="Loading" />
}

// We still need to cover here and in the settings "chart" type and some other types
// that were removed from UI in #463 because `frictionless-py` provides them
// as `resource.datatype`

const StyledCard = styled(Card)(() => ({
  width: '100%',
  height: '100%',
  minHeight: '95vh',
  border: 'none',
  boxShadow: 'none',
  borderRadius: 0,
  square: 'true',
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center',
}))

const StyledCardContent = styled(CardContent)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
}))

export const CONTROLLERS: {
  [type: string]: React.ElementType
} = {
  article: Text,
  chart: Text,
  dialect: Text,
  file: File,
  image: File,
  json: Text,
  jsonschema: Text,
  map: File,
  package: Text,
  resource: Text,
  schema: Text,
  script: Text,
  table: Table,
  text: Text,
  view: Text,
}
