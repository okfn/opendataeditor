import * as React from 'react'
import isEmpty from 'lodash/isEmpty'
import Box from '@mui/material/Box'
import ExportButton from '../../Views/Library/Buttons/ExportButton'
import DefaultButton from '../../Views/Library/Buttons/DefaultButton'
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
        <Revert />
        <Commit />
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
    />
  )
}

function Import() {
  const importTable = useStore((state) => state.importTable)
  return (
    <DefaultButton
      label="Import"
      onClick={() => (importTable ? importTable() : undefined)}
    />
  )
}

function Commit() {
  const commitPatch = useStore((state) => state.commitPatch)
  const tablePatch = useStore((state) => state.tablePatch)
  return (
    <CommitButton
      variant={isEmpty(tablePatch) ? 'outlined' : 'contained'}
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
      variant={isEmpty(tablePatch) ? 'outlined' : 'contained'}
      disabled={isEmpty(tablePatch)}
      onClick={revertPatch}
    />
  )
}
