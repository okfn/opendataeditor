import * as React from 'react'
import Box from '@mui/material/Box'
import MultilineField from '../../Parts/Fields/MultilineField'
import Alert from '@mui/material/Alert';
import { useStore } from './store'

export default function Query() {
  const query = useStore((state) => state.view.query)
  const setQuery = useStore((state) => state.setQuery)
  const viewError = useStore((state) => state.viewError)

  return (
    <Box>
      { (viewError) ?
      <Alert sx={{marginTop: 2}} severity="error">{viewError?.message}</Alert> :''
      }
      <MultilineField
        rows={12}
        label="Query"
        value={query}
        onChange={(query) => setQuery(query)}
      />
    </Box>
  )
}
