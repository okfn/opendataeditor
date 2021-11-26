import * as React from 'react'
import yaml from 'js-yaml'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Preview() {
  const descriptor = useStore((state) => state.descriptor)
  const exportFormat = useStore((state) => state.exportFormat)
  const isYaml = exportFormat === 'yaml'
  // TODO: don't use yaml/json dependency here
  const text = isYaml ? yaml.dump(descriptor) : JSON.stringify(descriptor, null, 2)
  return (
    <Box sx={{ height: '352px', overflowY: 'auto' }}>
      <pre style={{ marginTop: 0 }}>
        <code>{text}</code>
      </pre>
    </Box>
  )
}
