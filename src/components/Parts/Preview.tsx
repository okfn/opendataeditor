import * as React from 'react'
import yaml from 'js-yaml'
import Box from '@mui/material/Box'

// TODO: remove height
// TODO: improve descriptor/format typing

interface PreviewProps {
  format: string
  descriptor: object
  height?: string
}

export default function Preview(props: PreviewProps) {
  const isYaml = props.format === 'yaml'
  const text = isYaml
    ? yaml.dump(props.descriptor)
    : JSON.stringify(props.descriptor, null, 2)
  return (
    <Box
      sx={{
        height: props.height || '100%',
        overflow: 'auto',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '0.4em',
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
      <pre style={{ marginTop: 0, marginBottom: 0 }}>
        <code>{text}</code>
      </pre>
    </Box>
  )
}
