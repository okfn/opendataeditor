import * as React from 'react'
import noop from 'lodash/noop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ExportButton from '../../Views/Library/Buttons/ExportButton'
import CommitButton from '../../Views/Library/Buttons/CommitButton'
import RevertButton from '../../Views/Library/Buttons/RevertButton'
import Columns from '../../Views/Library/Columns'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Actions() {
  const theme = useTheme()
  const height = `calc(${theme.spacing(8)} - 1px)`
  return (
    <Box sx={{ lineHeight: height, borderTop: 1, borderColor: 'divider', paddingX: 2 }}>
      <Columns spacing={3}>
        <Export />
        <Import />
        <Commit />
        <Revert />
      </Columns>
    </Box>
  )
}

function Export() {
  const [format, setFormat] = React.useState('csv')
  const exportFile = useStore((state) => state.exportFile)
  return (
    <ExportButton
      format={format}
      options={['csv', 'xlsx']}
      onExport={() => (exportFile ? exportFile(format) : undefined)}
      onPreview={() => (exportFile ? exportFile(format) : undefined)}
      setFormat={setFormat}
      variant="contained"
    />
  )
}

function Import() {
  const importFile = useStore((state) => state.importFile)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Import table"
      color="info"
      onClick={() => (importFile ? importFile() : undefined)}
    >
      Import
    </Button>
  )
}

function Commit() {
  return <CommitButton variant="contained" disabled={true} onClick={noop} />
}

function Revert() {
  return <RevertButton variant="contained" disabled={true} onClick={noop} />
}
