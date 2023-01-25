import * as React from 'react'
import noop from 'lodash/noop'
import Box from '@mui/material/Box'
import DefaultButton from '../../Library/Buttons/DefaultButton'
import ExportButton from '../../Library/Buttons/ExportButton'
import CommitButton from '../../Library/Buttons/CommitButton'
import RevertButton from '../../Library/Buttons/RevertButton'
import Columns from '../../Library/Columns'
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
    />
  )
}

function Import() {
  const importFile = useStore((state) => state.importFile)
  return (
    <DefaultButton
      label="Import"
      onClick={() => (importFile ? importFile() : undefined)}
    />
  )
}

function Commit() {
  return <CommitButton disabled={true} onClick={noop} />
}

function Revert() {
  return <RevertButton disabled={true} onClick={noop} />
}
