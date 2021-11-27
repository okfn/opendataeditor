import * as React from 'react'
import { styled } from '@mui/material/styles'
import GridViewIcon from '@mui/icons-material/GridView'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'
import Constraints from './Constraints'
import ForeignKeys from './ForeignKeys'
import ForeignKey from './ForeignKey'
import Fields from './Fields'
import Field from './Field'
import { useStore } from '../store'

export default function Elements() {
  return (
    <Box>
      <Header />
      <Content />
    </Box>
  )
}

function Header() {
  const isElementGrid = useStore((state) => state.isElementGrid)
  const elementQuery = useStore((state) => state.elementQuery)
  const setElementQuery = useStore((state) => state.setElementQuery)
  const toggleIsElementGrid = useStore((state) => state.toggleIsElementGrid)
  const setElementType = useStore((state) => state.setElementType)
  const addField = useStore((state) => state.addField)
  return (
    <Box>
      <Typography variant="h6">
        <FormControl>
          <InputLabel id="edit">Edit</InputLabel>
          <Select
            size="small"
            labelId="edit"
            label="Edit"
            value="fields"
            onChange={(ev) => setElementType(ev.target.value)}
          >
            <MenuItem value="fields">Fields</MenuItem>
            <MenuItem value="foreignKeys">Foreign Keys</MenuItem>
          </Select>
        </FormControl>
        <Button sx={{ m: 0, p: 0, ml: 2, mt: '4px' }} onClick={() => addField()}>
          Add Field
        </Button>
        <Search
          type="text"
          placeholder="Search..."
          value={elementQuery || ''}
          onChange={(ev) => setElementQuery(ev.target.value)}
          sx={{ float: 'right', height: '36px' }}
        />
        <IconButton
          sx={{
            float: 'right',
            color: isElementGrid ? 'warning.main' : '#777',
            p: 0,
            mt: '8px',
            mr: '10px',
          }}
          aria-label="Show grid"
          title="Toggle grid view"
          onClick={() => toggleIsElementGrid()}
        >
          <GridViewIcon />
        </IconButton>
      </Typography>
    </Box>
  )
}

function Content() {
  const elementType = useStore((state) => state.elementType)
  switch (elementType) {
    case 'constraints':
      return <Constraints />
    case 'foreignKeys':
      return <ForeignKeys />
    case 'foreignKey':
      return <ForeignKey />
    case 'fields':
      return <Fields />
    case 'field':
      return <Field />
    default:
      return null
  }
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
