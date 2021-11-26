import * as React from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import GridViewIcon from '@mui/icons-material/GridView'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Fields() {
  const descriptor = useStore((state) => state.descriptor)
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)
  const isGridView = useStore((state) => state.isGridView)
  const toggleIsGridView = useStore((state) => state.toggleIsGridView)
  const fields = searchQuery
    ? descriptor.fields.filter((field) => field.name.includes(searchQuery))
    : descriptor.fields
  return (
    <FormControl fullWidth>
      <Typography variant="h6">
        Fields
        <Search
          type="text"
          placeholder="Search..."
          value={searchQuery || ''}
          onChange={(ev) => setSearchQuery(ev.target.value)}
          sx={{ float: 'right', height: '30px' }}
        />
        <IconButton
          sx={{
            float: 'right',
            color: isGridView ? 'warning.main' : '#777',
            p: 0,
            mt: '5px',
            mr: '10px',
          }}
          aria-label="Show grid"
          title="Toggle grid view"
          onClick={() => toggleIsGridView()}
        >
          <GridViewIcon />
        </IconButton>
      </Typography>
      <Box sx={{ maxHeight: '310px', overflowY: 'auto' }}>
        {fields.map((field) => (
          <Button
            size="large"
            color="info"
            variant="outlined"
            endIcon={isGridView ? null : field.type.toUpperCase()}
            key={field.name}
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

const Search = styled('input')({
  borderRadius: '4px',
  border: 'solid 1px #ccc',
  paddingLeft: '8px',
  paddingRight: '8px',
  '&:focus': {
    outline: 'none',
  },
})
