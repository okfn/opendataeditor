import * as React from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import ImportButton from '../Library/Buttons/ImportButton'
import CommitButton from '../Library/Buttons/CommitButton'
import RevertButton from '../Library/Buttons/RevertButton'
import Columns from '../Library/Columns'
import { useStore } from './store'

// TODO: review divider

export default function Actions() {
  return (
    <Box sx={{ mt: 2, borderTop: 'solid 1px #ddd', lineHeight: '63px' }}>
      <Columns spacing={3}>
        <Export />
        <Import />
        <Commit />
        <Revert />
      </Columns>
    </Box>
  )
}

// TODO: Implement in Library
function Export() {
  const isPreview = useStore((state) => state.isPreview)
  const exportFormat = useStore((state) => state.exportFormat)
  const exporter = useStore((state) => state.exporter)
  const preview = useStore((state) => state.preview)
  const isJsonPreview = isPreview && exportFormat === 'json'
  const isYamlPreview = isPreview && exportFormat === 'yaml'
  return (
    <ButtonGroup
      variant="outlined"
      color="info"
      aria-label="export"
      sx={{ width: '100%' }}
    >
      <Button
        title={`Export descriptor as ${exportFormat.toUpperCase()}`}
        onClick={exporter}
        sx={{ width: '60%' }}
      >
        Export
      </Button>
      <Button
        title="Toggle JSON preview"
        onClick={() => preview('json')}
        color={isJsonPreview ? 'warning' : 'info'}
      >
        JSON
      </Button>
      <Button
        title="Toggle YAML preview"
        onClick={() => preview('yaml')}
        color={isYamlPreview ? 'warning' : 'info'}
      >
        YAML
      </Button>
    </ButtonGroup>
  )
}

function Import() {
  const importer = useStore((state) => state.importer)
  return <ImportButton handleImport={importer} />
}

function Commit() {
  const isUpdated = useStore((state) => state.isUpdated)
  const commit = useStore((state) => state.commit)
  return <CommitButton disabled={!isUpdated} handleClick={commit} />
}

function Revert() {
  const isUpdated = useStore((state) => state.isUpdated)
  const revert = useStore((state) => state.revert)
  return <RevertButton disabled={!isUpdated} handleClick={revert} />
}
