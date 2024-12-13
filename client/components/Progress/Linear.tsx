import * as types from '@client/types'
import Box from '@mui/material/Box'
import MuiLinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import { startCase } from 'lodash'
import { useTranslation } from 'react-i18next'

export function LinearProgress(props: { progress?: types.IProgress }) {
  const { t } = useTranslation()
  const { progress } = props

  if (!progress || progress.hidden) {
    return null
  }

  if (progress.type === 'error') {
    return (
      <Box sx={{ color: 'red' }}>
        {t('error')}: {progress.message}
      </Box>
    )
  }

  return (
    <Stack spacing={1}>
      <Box>{progress.title || startCase(progress.type)}...</Box>
      <MuiLinearProgress
        sx={{
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#00D1FF',
          },
          padding: '10px',
        }}
      />
      <Box sx={{ color: 'gray' }}>{progress.message}</Box>
    </Stack>
  )
}
