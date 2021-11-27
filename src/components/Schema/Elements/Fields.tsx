import * as React from 'react'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import { useStore } from '../store'

export default function Fields() {
  const descriptor = useStore((state) => state.descriptor)
  const searchQuery = useStore((state) => state.searchQuery)
  const isGridView = useStore((state) => state.isGridView)
  const setSelectedIndex = useStore((state) => state.setSelectedIndex)
  const setPage = useStore((state) => state.setPage)
  const fields = searchQuery
    ? descriptor.fields.filter((field) => field.name.includes(searchQuery))
    : descriptor.fields
  return (
    <FormControl fullWidth>
      <Box sx={{ maxHeight: '310px', overflowY: 'auto' }}>
        {fields.map((field, index) => (
          <Button
            size="large"
            color="info"
            variant="outlined"
            endIcon={isGridView ? null : field.type.toUpperCase()}
            onClick={() => {
              setSelectedIndex(index)
              setPage('field')
            }}
            key={index}
            sx={{
              width: isGridView ? 'inherit' : '100%',
              marginRight: isGridView ? 2 : 0,
              justifyContent: 'space-between',
              textTransform: 'initial',
              p: [2, 2],
              mt: 2,
            }}
          >
            {field.name}
          </Button>
        ))}
      </Box>
    </FormControl>
  )
}
