import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

export interface MissingProps {
  format?: string
}

export default function Missing(props: MissingProps) {
  if (!props.format) return null
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: '#fafafa',
        padding: 2,
        color: '#777',
      }}
    >
      {t('preview-not-available')} ({props.format})
    </Box>
  )
}
