import * as React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'

interface ExportButtonProps {
  format: string
  isPreview?: boolean
  handleExport: () => void
  handlePreview: (format: string) => void
}

export default function ExportButton(props: ExportButtonProps) {
  const isJsonPreview = props.isPreview && props.format === 'json'
  const isYamlPreview = props.isPreview && props.format === 'yaml'
  return (
    <ButtonGroup
      variant="outlined"
      color="info"
      aria-label="export"
      sx={{ width: '100%' }}
    >
      <Button
        title={`Export descriptor as ${props.format.toUpperCase()}`}
        onClick={() => props.handleExport()}
        sx={{ width: '60%' }}
      >
        Export
      </Button>
      <Button
        title="Toggle JSON preview"
        onClick={() => props.handlePreview('json')}
        color={isJsonPreview ? 'warning' : 'info'}
      >
        JSON
      </Button>
      <Button
        title="Toggle YAML preview"
        onClick={() => props.handlePreview('yaml')}
        color={isYamlPreview ? 'warning' : 'info'}
      >
        YAML
      </Button>
    </ButtonGroup>
  )
}
