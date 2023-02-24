import * as React from 'react'
import Box from '@mui/material/Box'
import MultilineField from '../../Parts/Fields/MultilineField'
import { useStore } from './store'

export default function Query() {
  const query = useStore((state) => state.view.query)
  const setQuery = useStore((state) => state.setQuery)
  const viewError = useStore((state) => state.viewError)

  return (
    <Box>
      <MultilineField
        rows={12}
        label="Query"
        value={query}
        onChange={(query) => setQuery(query)}
      />
      {viewError?.message}
    </Box>
  )
}
