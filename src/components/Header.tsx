import * as React from 'react'
import { alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import HelpOutline from '@mui/icons-material/HelpOutline'
import InputBase from '@mui/material/InputBase'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// General

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <Grid container>
            <Grid item xs={3}>
              <Typography variant="h5" sx={{ ml: 2 }}>
                &nbsp;<strong>Frictionless Application</strong>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Box
                sx={{
                  flexGrow: 1,
                  position: 'relative',
                  borderRadius: 'shape.borderRadius',
                  backgroundColor: alpha('#fff', 0.15),
                  '&:hover': {
                    backgroundColor: alpha('#fff', 0.25),
                  },
                  marginLeft: 1,
                  marginRight: 4,
                }}
              >
                <Box
                  sx={{
                    padding: [0, 2],
                    height: '100%',
                    position: 'absolute',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SearchIcon />
                </Box>
                <InputBase
                  placeholder="Select File…"
                  sx={{
                    color: 'inherit',
                    padding: [1, 1, 1, 0],
                    paddingLeft: '2em',
                    width: '100%',
                    md: {
                      width: '20ch',
                    },
                  }}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Grid container justifyContent="flex-end">
                <Button color="inherit">
                  <HelpOutline />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
