import * as React from 'react'
import Box from '@mui/material/Box'
import { ErrorBoundary } from 'react-error-boundary'
import File from '../Controllers/File'
import Table from '../Controllers/Table'
import Text from '../Controllers/Text'
import SpinnerCard from '../Parts/Cards/Spinner'
import * as store from '@client/store'
import { client } from '@client/client'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import emptyContentScreenImg from '../../assets/empty_screen.png'

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
  if (!record) return null

  const Controller = CONTROLLERS[record.type] || File

  return (
    <ErrorBoundary
      fallback={
        <Box sx={{ padding: 2.5, color: '#555' }}>
          <strong>Failed to open the file</strong>. Please{' '}
          <a href="https://github.com/okfn/opendataeditor/issues" target="_blank">
            create an issue
          </a>{' '}
          sharing the file contents <small>(if possible)</small>
        </Box>
      }
    >
      <Controller path={record.path} client={client} />
    </ErrorBoundary>
  )
}

function EmptyContent() {
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
          The ODE supports Excel & csv files
        </Typography>
        <Button
          sx={{ my: 0.5, width: '236px', textTransform: 'none' }}
          variant="contained"
          aria-label="accept"
          onClick={() => store.openDialog('fileUpload')}
        >
          Upload your data
        </Button>
        <Typography
          sx={{
            paddingTop: '8px',
            fontWeight: 500,
            color: '#6B7380',
            fontSize: '12px',
          }}
        >
          You can also add links to online tables
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
