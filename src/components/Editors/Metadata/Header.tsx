import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { alpha, styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import InputIcon from '@mui/icons-material/Input'
// import GithubIcon from '@mui/icons-material/GitHub'
import SupportIcon from '@mui/icons-material/SupportAgent'
import HelpIcon from '@mui/icons-material/Help'
import SettingsIcon from '@mui/icons-material/Settings'
import InputBase from '@mui/material/InputBase'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// TODO: rebase from props to state
export default function Header() {
  const theme = useTheme()
  const height = theme.spacing(8)
  return (
    <Box sx={{ height, flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar disableGutters>
          <Grid container>
            <Grid item xs={3}>
              <Typography variant="h5" sx={{ ml: 2, mt: '4px', cursor: 'pointer' }}>
                <strong>
                  Frictionless Metadata{' '}
                  <Chip
                    size="small"
                    label="beta"
                    variant="outlined"
                    sx={{ color: 'white', borderRadius: 1 }}
                  />
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Search>
                <SearchIconWrapper>
                  <InputIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Metadata editors for Frictionless standards"
                  inputProps={{ 'aria-label': 'search' }}
                  readOnly
                  value={''}
                />
              </Search>
            </Grid>
            <Grid item xs={2}>
              <Grid container justifyContent="flex-end">
                <Button title="Settings" color="inherit" disabled>
                  <SettingsIcon />
                </Button>
                <Button
                  title="Community"
                  color="inherit"
                  href="https://join.slack.com/t/frictionlessdata/shared_invite/zt-17kpbffnm-tRfDW_wJgOw8tJVLvZTrBg"
                  target="_blank"
                >
                  <SupportIcon />
                </Button>
                <Button
                  title="Documentation"
                  color="inherit"
                  href="https://application.frictionlessdata.io"
                  target="_blank"
                >
                  <HelpIcon />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& ::file-selector-button': {
    display: 'none',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))
