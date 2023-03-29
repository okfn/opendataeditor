import * as React from 'react'
import Box from '@mui/material/Box'

interface ScrollBoxProps {
  height?: string
}

export default function ScrollBox(props: React.PropsWithChildren<ScrollBoxProps>) {
  return (
    <Box
      sx={{
        height: props.height,
        overflow: 'auto',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '0.4em',
          height: '0.4em',
        },
        '&::-webkit-scrollbar-track': {
          borderRadius: '3px',
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '3px',
          backgroundColor: '#888',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      }}
    >
      {props.children}
    </Box>
  )
}
