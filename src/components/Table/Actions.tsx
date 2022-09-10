import * as React from 'react'
import isEmpty from 'lodash/isEmpty'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ExportButton from '../Library/Buttons/ExportButton'
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
  const [format, setFormat] = React.useState('csv')
  const exportTable = useStore((state) => state.exportTable)
  return (
    <ExportButton
      format={format}
      options={['csv', 'xlsx']}
      onExport={() => (exportTable ? exportTable(format) : undefined)}
      onPreview={() => (exportTable ? exportTable(format) : undefined)}
      setFormat={setFormat}
      variant="contained"
    />
  )
}

function Import() {
  const importTable = useStore((state) => state.importTable)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Import table"
      color="info"
      onClick={() => (importTable ? importTable() : undefined)}
    >
      Import
    </Button>
  )
}

function Commit() {
  const commitPatch = useStore((state) => state.commitPatch)
  const tablePatch = useStore((state) => state.tablePatch)
  return (
    <CommitButton
      variant="contained"
      disabled={isEmpty(tablePatch)}
      onClick={commitPatch}
    />
  )
}

function Revert() {
  const revertPatch = useStore((state) => state.revertPatch)
  const tablePatch = useStore((state) => state.tablePatch)
  return (
    <RevertButton
      variant="contained"
      disabled={isEmpty(tablePatch)}
      onClick={revertPatch}
    />
  )
}
