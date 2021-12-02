import * as React from 'react'
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
      color="info"
      fullWidth
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
  return (
    <Button
      title="Commit changes to use them further"
      variant="contained"
      color="info"
      fullWidth
    >
      Source
    </Button>
  )
}

function Report() {
  return (
    <Button
      title="Revert changes to the initial state"
      variant="contained"
      color="success"
      fullWidth
    >
      Report (Valid)
    </Button>
  )
}

function Errors() {
  return (
    <Button
      title="Commit changes to use them further"
      variant="contained"
      color="success"
      fullWidth
    >
      Errors (0)
    </Button>
  )
}
