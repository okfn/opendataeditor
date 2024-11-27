import * as store from '@client/store'
import { Box } from '@mui/material'

export default function View() {
  const format = store.useStore((state) => state.record?.resource.format)

  let message = 'Preview is not available for this file format'
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
