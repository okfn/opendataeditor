import * as React from 'react'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import Columns from '../Library/Columns'
import { useStore } from './store'

// TODO: review divider

export default function Actions() {
  return (
    <Box>
      <Divider sx={{ mt: 2, mb: 3 }} />
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
      variant="contained"
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

// TODO: Implement in Library
function Import() {
  const importer = useStore((state) => state.importer)
  return (
    <label htmlFor="import-button">
      <input
        type="file"
        id="import-button"
        accept=".json, .yaml"
        style={{ display: 'none' }}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          if (ev.target.files) importer(ev.target.files[0])
          ev.target.value = ''
        }}
      />
      <Button
        title="Import descriptor as JSON or YAML"
        variant="contained"
        component="span"
        color="info"
        fullWidth
      >
        Import
      </Button>
    </label>
  )
}

function Commit() {
  const isUpdated = useStore((state) => state.isUpdated)
  const commit = useStore((state) => state.commit)
  return (
    <Button
      title="Commit changes to use them further"
      variant="contained"
      disabled={!isUpdated}
      onClick={commit}
      color="success"
      fullWidth
    >
      Commit
    </Button>
  )
}

function Revert() {
  const isUpdated = useStore((state) => state.isUpdated)
  const revert = useStore((state) => state.revert)
  return (
    <Button
      title="Revert changes to the initial state"
      variant="contained"
      disabled={!isUpdated}
      onClick={revert}
      color="error"
      fullWidth
    >
      Revert
    </Button>
  )
}
