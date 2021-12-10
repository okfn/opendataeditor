import * as React from 'react'
import Box from '@mui/material/Box'
import { IFile } from '../../interfaces'

// TODO: restyle scrolls (use Table's style)

interface FileProps {
  file: IFile
}

export default function File(props: FileProps) {
  return (
    <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <pre style={{ margin: 0 }}>
        <code>{props.file.text}</code>
      </pre>
    </Box>
  )
}
