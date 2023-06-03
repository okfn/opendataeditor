import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import SettingsIcon from '@mui/icons-material/Settings'
import GithubIcon from '@mui/icons-material/GitHub'
import HelpIcon from '@mui/icons-material/Help'
import LightTooltip from '../../Parts/Tooltips/Light'
import Status from './Status'
import { useStore } from './store'

export default function Header() {
  const theme = useTheme()
  const height = theme.spacing(8)
  const onFileSelect = useStore((state) => state.onFileSelect)
  return (
    <Box sx={{ height, flexGrow: 1 }}>
      <AppBar position="static" color="secondary" elevation={0}>
        <Toolbar disableGutters>
          <Grid container>
            <Grid item xs={4} lg={3}>
              <LightTooltip title="Show the welcome screen">
                <Typography
                  variant="h5"
                  sx={{ ml: 2, mt: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onClick={() => onFileSelect(undefined)}
                >
                  <strong>
                    Frictionless Application{' '}
                    <Chip
                      size="small"
                      label="beta"
                      variant="outlined"
                      sx={{ color: 'white', borderRadius: 1 }}
                    />
                  </strong>
                </Typography>
              </LightTooltip>
            </Grid>
            <Grid item xs={5} lg={7}>
              <Status />
            </Grid>
            <Grid item xs={3} lg={2}>
              <Grid container justifyContent="flex-end">
                <LightTooltip title="Open settings">
                  <Box>
                    <Button disabled color="inherit">
                      <SettingsIcon />
                    </Button>
                  </Box>
                </LightTooltip>
                <LightTooltip title="Report an issue">
                  <Button
                    color="inherit"
                    href="https://github.com/frictionlessdata/application/issues"
                    target="_blank"
                  >
                    <GithubIcon />
                  </Button>
                </LightTooltip>
                <LightTooltip title="Open documentation">
                  <Button
                    color="inherit"
                    href="https://application.frictionlessdata.io"
                    target="_blank"
                  >
                    <HelpIcon />
                  </Button>
                </LightTooltip>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
