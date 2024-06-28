import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import SettingsIcon from '@mui/icons-material/Settings'
import GithubIcon from '@mui/icons-material/GitHub'
import HelpIcon from '@mui/icons-material/Help'
import LightTooltip from '../Parts/Tooltips/Light'
import ReportChip from '../Parts/Chips/Report'
import * as store from '@client/store'

export default function Header() {
  const measure = store.useStore((state) => state.main.measure)

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar disableGutters>
        <LightTooltip title="Show the project page">
          <Typography
            sx={{
              fontSize: '28px',
              ml: 2,
              cursor: 'pointer',
            }}
            onClick={() => store.main.closeFile()}
          >
            <strong>Open Data Editor</strong>
          </Typography>
        </LightTooltip>
        <Box sx={{ ml: 'auto' }}></Box>
        <ReportChip errorCount={measure ? measure.errors : undefined} />
        <LightTooltip title="Open config dialog">
          <Box>
            <Button color="inherit" onClick={() => store.main.openDialog('config')}>
              <SettingsIcon />
            </Button>
          </Box>
        </LightTooltip>
        <LightTooltip title="Report an issue">
          <Button
            color="inherit"
            href="https://github.com/okfn/opendataeditor/issues"
            target="_blank"
          >
            <GithubIcon />
          </Button>
        </LightTooltip>
        <LightTooltip title="Open documentation">
          <Button color="inherit" href="https://opendataeditor.okfn.org" target="_blank">
            <HelpIcon />
          </Button>
        </LightTooltip>
      </Toolbar>
    </AppBar>
  )
}
