import * as React from 'react'
import Box from '@mui/material/Box'
import MultilineField from '../../../Parts/Fields/MultilineField'
import Columns from '../../../Parts/Columns'
import { useStore } from '../store'

export default function ConfigPanel() {
  const query = useStore((state) => state.query)
  const setQuery = useStore((state) => state.setQuery)
  return (
    <Columns spacing={2}>
      <MultilineField
        rows={12}
        label="Query"
        value={query}
        onChange={(query) => setQuery(query)}
      />
      <Box sx={{ padding: 2 }}>field explorer</Box>
    </Columns>
  )
}
