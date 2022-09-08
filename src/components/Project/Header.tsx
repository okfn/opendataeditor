import * as React from 'react'
import Chip from '@mui/material/Chip'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function Status() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar disableGutters>
          <Typography variant="h5" sx={{ ml: 2, mt: '4px', cursor: 'pointer' }}>
            <strong>
              Frictionless Application{' '}
              <Chip
                size="small"
                label="alpha"
                variant="outlined"
                sx={{ color: 'white', borderRadius: 1 }}
              />
            </strong>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
