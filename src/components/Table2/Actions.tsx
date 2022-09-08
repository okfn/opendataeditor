import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ExportButton from '../Library/Buttons/ExportButton'
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
        <Source />
        <Metadata />
        <Report />
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
      setFormat={setFormat}
      variant="contained"
    />
  )
}

function Source() {
  const viewType = useStore((state) => state.viewType)
  const setViewType = useStore((state) => state.setViewType)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toogle source view"
      color={viewType === 'source' ? 'warning' : 'info'}
      onClick={() => setViewType('source')}
    >
      Source
    </Button>
  )
}

function Metadata() {
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const toggleMetadataOpen = useStore((state) => state.toggleMetadataOpen)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toggle metadata"
      color={isMetadataOpen ? 'warning' : 'info'}
      onClick={toggleMetadataOpen}
    >
      Metadata
    </Button>
  )
}

function Report() {
  const report = useStore((state) => state.report)
  const viewType = useStore((state) => state.viewType)
  const setViewType = useStore((state) => state.setViewType)
  if (!report) return null
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toggle report view"
      color={viewType === 'report' ? 'warning' : report.valid ? 'success' : 'error'}
      onClick={() => setViewType('report')}
    >
      Report ({report.valid ? 'Valid' : 'Invalid'})
    </Button>
  )
}
