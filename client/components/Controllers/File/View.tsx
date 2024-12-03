import * as store from '@client/store'
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function View() {
  const { t } = useTranslation()
  const format = store.useStore((state) => state.record?.resource.format)

  let message = t('preview-not-available')
  if (format) {
    message = [message, `(${format})`].join(' ')
  }

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
      {message}
    </Box>
  )
}
