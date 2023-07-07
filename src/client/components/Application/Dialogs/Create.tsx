import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import SourceIcon from '@mui/icons-material/Source'
import TerminalIcon from '@mui/icons-material/Terminal'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import BaseDialog from '../../Parts/Dialogs/Base'
import { useStore } from '../store'

export default function CreateDialog() {
  const updateState = useStore((state) => state.updateState)
  return (
    <BaseDialog
      open={true}
      maxWidth="md"
      onCancel={() => updateState({ dialog: undefined })}
    >
      <Grid container sx={{ border: 'solid 1px #fff' }}>
        <Grid item md={3}>
          <Box sx={{ height: '200px' }}>
            <Chip
              onClick={() => updateState({ dialog: 'createArticle' })}
              color="primary"
              label="Article"
              icon={<HistoryEduIcon sx={{ fontSize: '2em' }} />}
              size="medium"
              sx={{
                width: '100%',
                height: '100%',
                borderRight: 'solid 1px #fff',
                borderRadius: '3px',
                fontSize: '2em',
              }}
            />
          </Box>
        </Grid>
        <Grid item md={3}>
          <Box sx={{ height: '200px' }}>
            <Chip
              color="primary"
              label="Chart"
              icon={<LeaderboardIcon sx={{ fontSize: '2em' }} />}
              size="medium"
              sx={{
                width: '100%',
                height: '100%',
                borderRight: 'solid 1px #fff',
                borderRadius: '3px',
                fontSize: '2em',
              }}
            />
          </Box>
        </Grid>
        <Grid item md={3}>
          <Box sx={{ height: '200px' }}>
            <Chip
              color="primary"
              label="Dataset"
              icon={<SourceIcon sx={{ fontSize: '2em' }} />}
              size="medium"
              sx={{
                width: '100%',
                height: '100%',
                borderRight: 'solid 1px #fff',
                borderRadius: '3px',
                fontSize: '2em',
              }}
            />
          </Box>
        </Grid>
        <Grid item md={3}>
          <Box sx={{ height: '200px' }}>
            <Chip
              color="primary"
              label="Script"
              icon={<TerminalIcon sx={{ fontSize: '2em' }} />}
              size="medium"
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '3px',
                fontSize: '2em',
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </BaseDialog>
  )
}
