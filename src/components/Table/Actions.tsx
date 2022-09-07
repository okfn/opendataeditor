import * as React from 'react'
import excel from 'xlsx'
import csv from 'papaparse'
import FileSaver from 'file-saver'
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
  const name = useStore((state) => state.name)
  const table = useStore((state) => state.table!)
  const [format, setFormat] = React.useState('csv')
  // TODO: move to store
  const handleExport = () => {
    if (format === 'csv') {
      const text = csv.unparse(table.rows)
      const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
      FileSaver.saveAs(blob, `${name}.csv`)
    } else if (format === 'xlsx') {
      const wb = excel.utils.book_new()
      const ws = excel.utils.json_to_sheet(table.rows)
      excel.utils.book_append_sheet(wb, ws)
      const bytes = excel.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([bytes], { type: 'application/octet-stream' })
      FileSaver.saveAs(blob, `${name}.xlsx`)
    }
  }
  return (
    <ExportButton
      format={format}
      options={['csv', 'xlsx']}
      onExport={handleExport}
      setFormat={setFormat}
      variant="contained"
    />
  )
}

function Source() {
  const contentType = useStore((state) => state.contentType)
  const setContentType = useStore((state) => state.setContentType)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toogle source view"
      color={contentType === 'source' ? 'warning' : 'info'}
      onClick={() => setContentType('source')}
    >
      Source
    </Button>
  )
}

function Metadata() {
  const onMetadataClick = useStore((state) => state.onMetadataClick)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toggle metadata"
      color="info"
      onClick={() => onMetadataClick()}
    >
      Metadata
    </Button>
  )
}

function Report() {
  const report = useStore((state) => state.report)
  const contentType = useStore((state) => state.contentType)
  const setContentType = useStore((state) => state.setContentType)
  if (!report) return null
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toggle report view"
      color={contentType === 'report' ? 'warning' : report.valid ? 'success' : 'error'}
      onClick={() => setContentType('report')}
    >
      Report ({report.valid ? 'Valid' : 'Invalid'})
    </Button>
  )
}
