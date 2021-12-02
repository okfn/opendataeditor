import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import Columns from '../Library/Columns'
import { useStore } from './store'

export default function Footer() {
  const resource = useStore((state) => state.resource)
  return (
    <Box
      sx={{
        borderTop: 'solid 1px #ddd',
        lineHeight: '63px',
        pl: 2,
        pr: 2,
        opacity: resource ? 1 : 1,
      }}
    >
      <Columns spacing={3} layout={[3, 9]}>
        <Metadata />
        <Actions />
      </Columns>
    </Box>
  )
}

function Metadata() {
  return (
    <Button
      disabled
      color="info"
      fullWidth
      variant="outlined"
      endIcon={<ArrowDropUpIcon />}
    >
      Metadata
    </Button>
  )
}

function Actions() {
  return (
    <Columns spacing={3}>
      <ButtonGroup
        variant="contained"
        color="info"
        aria-label="export"
        sx={{ width: '100%' }}
      >
        <Button disabled title="Export descriptor" sx={{ width: '60%' }}>
          Export
        </Button>
        <Button disabled title="Toggle JSON preview">
          CSV
        </Button>
        <Button disabled title="Toggle YAML preview">
          EXCEL
        </Button>
      </ButtonGroup>
      <Button
        disabled
        title="Commit changes to use them further"
        variant="contained"
        color="info"
        fullWidth
      >
        Source
      </Button>
      <Button
        disabled
        title="Revert changes to the initial state"
        variant="contained"
        color="success"
        fullWidth
      >
        Report (Valid)
      </Button>
      <Button
        disabled
        title="Commit changes to use them further"
        variant="contained"
        color="success"
        fullWidth
      >
        Errors (0)
      </Button>
    </Columns>
  )
}
