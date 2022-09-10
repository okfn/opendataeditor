import noop from 'lodash/noop'
import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CommitButton from '../Library/Buttons/CommitButton'
import RevertButton from '../Library/Buttons/RevertButton'
import Columns from '../Library/Columns'
import { useStore } from './store'

export default function Actions() {
  return (
    <Box
      sx={{
        borderTop: 'solid 1px #ddd',
        lineHeight: '63px',
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
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
  const exportFile = useStore((state) => state.exportFile)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Export file"
      color="info"
      onClick={() => (exportFile ? exportFile() : undefined)}
    >
      Export
    </Button>
  )
}

function Import() {
  const importFile = useStore((state) => state.importFile)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Import file"
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
