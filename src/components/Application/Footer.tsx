import * as React from 'react'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

export default function Footer() {
  return (
    <Box sx={{ borderTop: 'solid 1px #ccc', lineHeight: '63px' }}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <ButtonGroup
            variant="contained"
            color="info"
            aria-label="export"
            sx={{ width: '100%' }}
          >
            <Button title="Export descriptor" sx={{ width: '60%' }}>
              Export
            </Button>
            <Button title="Toggle JSON preview">JSON</Button>
            <Button title="Toggle YAML preview">YAML</Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={3}>
          <label htmlFor="import-button">
            <input
              type="file"
              id="import-button"
              accept=".json, .yaml"
              style={{ display: 'none' }}
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
        </Grid>
        <Grid item xs={3}>
          <Button
            title="Commit changes to use them further"
            variant="contained"
            color="success"
            fullWidth
          >
            Commit
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            title="Revert changes to the initial state"
            variant="contained"
            color="error"
            fullWidth
          >
            Revert
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
