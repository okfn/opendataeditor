import * as React from 'react'
// import GridViewIcon from '@mui/icons-material/GridView'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
// import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
// import Grid from '@mui/material/Grid'
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
  const elementIndex = useStore((state) => state.elementIndex)
  // const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <Typography variant="h6">
      {elementIndex === undefined ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', lineHeight: '40px' }}
        >
          <Box>
            <TypeSelect />
            <AddButton />
            <GridButton />
          </Box>
          <SearchInput />
        </Box>
      ) : (
        <Box component="span" sx={{ lineHeight: '40px' }}>
          <TypeSelect />
          <ElementSelect />
          <RemoveButton />
          <ModeButton />
        </Box>
      )}
    </Typography>
  )
}

function TypeSelect() {
  const elementType = useStore((state) => state.elementType)
  const setElementType = useStore((state) => state.setElementType)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <FormControl>
      <InputLabel id="edit1" sx={{ color: 'black' }}>
        Edit
      </InputLabel>
      <Select
        size="small"
        labelId="edit1"
        label="Edit"
        value={elementType}
        onChange={(ev) => {
          setElementType(ev.target.value)
          setElementIndex()
        }}
        sx={{
          width: '130px',
          '& .MuiOutlinedInput-input': {
            fontSize: '18px',
            fontWeight: '500',
            color: 'black',
          },
          '& .MuiSelect-icon': {
            color: 'black',
          },
          '& fieldset': {
            borderColor: 'black',
          },
        }}
      >
        <MenuItem value="field">Fields</MenuItem>
        <MenuItem value="foreignKey">Foreign Keys</MenuItem>
      </Select>
    </FormControl>
  )
}

export function ElementSelect() {
  const descriptor = useStore((state) => state.descriptor)
  const elementType = useStore((state) => state.elementType)
  const elementIndex = useStore((state) => state.elementIndex)
  const setElementIndex = useStore((state) => state.setElementIndex)
  // TODO: remove
  if (elementType !== 'field') return null
  if (elementIndex === undefined) return null
  // TODO: revmoe "as" usage
  return (
    <FormControl>
      <InputLabel id="edit2" sx={{ color: 'black' }}>
        Edit
      </InputLabel>
      <Select
        size="small"
        labelId="edit2"
        label="Edit"
        value={elementIndex}
        onChange={(ev) => setElementIndex(parseInt(ev.target.value as string))}
        sx={{
          ml: 1,
          width: '130px',
          '& .MuiOutlinedInput-input': {
            fontSize: '18px',
            fontWeight: '500',
            color: 'black',
          },
          '& .MuiSelect-icon': {
            color: 'black',
          },
          '& fieldset': {
            borderColor: 'black',
          },
        }}
      >
        {descriptor.fields.map((field, index) => (
          <MenuItem key={index} value={index}>
            {field.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

function AddButton() {
  const elementType = useStore((state) => state.elementType)
  const addElement = useStore((state) => state.addElement)
  return (
    <Button onClick={() => addElement()}>
      Add {elementType === 'field' ? 'Field' : 'Foreign Key'}
    </Button>
  )
}

function GridButton() {
  const isElementGrid = useStore((state) => state.isElementGrid)
  const toggleIsElementGrid = useStore((state) => state.toggleIsElementGrid)
  return (
    <Button
      color={isElementGrid ? 'warning' : 'info'}
      onClick={() => toggleIsElementGrid()}
    >
      Grid View
    </Button>
  )
}

function RemoveButton() {
  const elementType = useStore((state) => state.elementType)
  const removeElement = useStore((state) => state.removeElement)
  return (
    <Button onClick={() => removeElement()}>
      Remove {elementType === 'field' ? 'Field' : 'Foreign Key'}
    </Button>
  )
}

function ModeButton() {
  const elementType = useStore((state) => state.elementType)
  const setElementMode = useStore((state) => state.setElementMode)
  if (elementType !== 'field') return null
  return <Button onClick={() => setElementMode('constraints')}>Constraints</Button>
}

// function BackButton() {
// const setElementIndex = useStore((state) => state.setElementIndex)
// return <Button onClick={() => setElementIndex()}>Fields</Button>
// }

// function GridViewButton() {
// return (
// <IconButton
// sx={{
// float: 'right',
// color: isElementGrid ? 'warning.main' : '#777',
// p: 0,
// mt: '8px',
// mr: '10px',
// }}
// aria-label="Show grid"
// title="Toggle grid view"
// onClick={() => toggleIsElementGrid()}
// >
// <GridViewIcon />
// </IconButton>
// )
// }

function SearchInput() {
  const elementQuery = useStore((state) => state.elementQuery)
  const setElementQuery = useStore((state) => state.setElementQuery)
  return (
    <InputBase
      type="text"
      placeholder="Search..."
      value={elementQuery || ''}
      onChange={(ev) => setElementQuery(ev.target.value)}
      sx={{
        width: '140px',
        paddingLeft: 1,
        paddingRight: 1,
        borderRadius: '4px',
        border: 'solid 1px #ccc',
        '&:focus': {
          outline: 'none',
        },
      }}
    />
  )
}

function Content() {
  const elementType = useStore((state) => state.elementType)
  const elementMode = useStore((state) => state.elementMode)
  const elementIndex = useStore((state) => state.elementIndex)
  switch (elementType) {
    case 'field':
      if (elementIndex === undefined) return <Fields />
      if (elementMode === 'constraints') return <Constraints />
      return <Field />
    case 'foreignKey':
      if (elementIndex === undefined) return <ForeignKeys />
      return <ForeignKey />
    default:
      return null
  }
}
