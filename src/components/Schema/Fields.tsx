import * as React from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import GridViewIcon from '@mui/icons-material/GridView'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Fields() {
  const descriptor = useStore((state) => state.descriptor)
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)
  const isGridView = useStore((state) => state.isGridView)
  const toggleIsGridView = useStore((state) => state.toggleIsGridView)
  const setSelectedIndex = useStore((state) => state.setSelectedIndex)
  const addField = useStore((state) => state.addField)
  const setPage = useStore((state) => state.setPage)
  const fields = searchQuery
    ? descriptor.fields.filter((field) => field.name.includes(searchQuery))
    : descriptor.fields
  return (
    <FormControl fullWidth>
      <Typography variant="h6">
        <InputLabel id="edit">Edit</InputLabel>
        <Select
          size="small"
          labelId="edit"
          label="Edit"
          value="fields"
          onChange={(ev) => setPage(ev.target.value)}
        >
          <MenuItem value="fields">Fields</MenuItem>
          <MenuItem value="foreignKeys">Foreign Keys</MenuItem>
        </Select>
        <Button sx={{ m: 0, p: 0, ml: 2, mt: '4px' }} onClick={() => addField()}>
          Add Field
        </Button>
        <Search
          type="text"
          placeholder="Search..."
          value={searchQuery || ''}
          onChange={(ev) => setSearchQuery(ev.target.value)}
          sx={{ float: 'right', height: '36px' }}
        />
        <IconButton
          sx={{
            float: 'right',
            color: isGridView ? 'warning.main' : '#777',
            p: 0,
            mt: '8px',
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

const Search = styled('input')({
  borderRadius: '4px',
  border: 'solid 1px #ccc',
  paddingLeft: '8px',
  paddingRight: '8px',
  '&:focus': {
    outline: 'none',
  },
})
