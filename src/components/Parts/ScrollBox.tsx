import * as React from 'react'
import Box, { BoxProps } from '@mui/material/Box'

interface ScrollBoxProps extends BoxProps {}

export default function ScrollBox(props: React.PropsWithChildren<ScrollBoxProps>) {
  const { sx, ...others } = props
  return (
    <Box
      sx={{
        height: props.height,
        overflow: 'auto',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          borderRadius: '3px',
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '3px',
          backgroundColor: '#ccc',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
        ...(sx || {}),
      }}
      {...others}
    >
      {props.children}
    </Box>
  )
}
