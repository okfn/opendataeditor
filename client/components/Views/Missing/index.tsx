import Box from '@mui/material/Box'

export interface MissingProps {
  format?: string
}

export default function Missing(props: MissingProps) {
  if (!props.format) return null
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: '#fafafa',
        padding: 2,
        color: '#777',
        fontFamily: 'Monospace',
      }}
    >
      Preview is not available for this file format ({props.format})
    </Box>
  )
}
