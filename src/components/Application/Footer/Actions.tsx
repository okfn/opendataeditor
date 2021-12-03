import * as React from 'react'
import { assert } from 'ts-essentials'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Columns from '../../Library/Columns'
import { useStore } from '../store'

export default function Actions() {
  return (
    <Columns spacing={3} layout={[3, 9]}>
      <ToggleMetadata />
      <Columns spacing={3}>
        <Export />
        <Source />
        <Report />
        <Errors />
      </Columns>
    </Columns>
  )
}

function ToggleMetadata() {
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const toggleMetadataOpen = useStore((state) => state.toggleMetadataOpen)
  return (
    <Button
      fullWidth
      color="info"
      variant="outlined"
      title="Toggle metadata editor"
      endIcon={isMetadataOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
      onClick={() => toggleMetadataOpen()}
    >
      Metadata
    </Button>
  )
}

function Export() {
  return (
    <ButtonGroup
      variant="contained"
      color="info"
      aria-label="export"
      sx={{ width: '100%' }}
    >
      <Button title="Export descriptor" sx={{ width: '60%' }}>
        Export
      </Button>
      <Button title="Toggle JSON preview">CSV</Button>
      <Button title="Toggle YAML preview">EXCEL</Button>
    </ButtonGroup>
  )
}

function Source() {
  const isSourceView = useStore((state) => state.isSourceView)
  const toggleSourceView = useStore((state) => state.toggleSourceView)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toogle source view"
      color={isSourceView ? 'warning' : 'info'}
      onClick={() => toggleSourceView()}
    >
      Source
    </Button>
  )
}

function Report() {
  const report = useStore((state) => state.report)
  const isReportView = useStore((state) => state.isReportView)
  const toggleReportView = useStore((state) => state.toggleReportView)
  assert(report)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toggle report view"
      color={isReportView ? 'warning' : report.valid ? 'success' : 'error'}
      onClick={() => toggleReportView()}
    >
      Report ({report.valid ? 'Valid' : 'Invalid'})
    </Button>
  )
}

function Errors() {
  const report = useStore((state) => state.report)
  const isErrorsView = useStore((state) => state.isErrorsView)
  // const toggleErrorsView = useStore((state) => state.toggleErrorsView)
  assert(report)
  return (
    <Button
      fullWidth
      variant="contained"
      title="Toggle errors view"
      color={isErrorsView ? 'warning' : report.valid ? 'success' : 'error'}
      onClick={() => alert('Under development')}
    >
      Errors ({report.stats.errors})
    </Button>
  )
}
