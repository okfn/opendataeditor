import * as React from 'react'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../../Library/Columns'
import HeadingBox from '../../Library/Groups/HeadingBox'
import HeadingButton from '../../Library/Groups/HeadingButton'
import HeadingSelector from '../../Library/Groups/HeadingSelector'
import Constraints from '../Elements/Constraints'
import ForeignKeys from '../Elements/ForeignKeys'
import ForeignKey from '../Elements/ForeignKey'
import Fields from '../Elements/Fields'
import Field from '../Elements/Field'
import { useStore } from '../store'

export default function Element() {
  return (
    <Box>
      <Header />
      <Content />
    </Box>
  )
}

function Header() {
  const elementIndex = useStore((state) => state.elementIndex)
  return elementIndex === undefined ? <ListingHeader /> : <ItemHeader />
}

function ListingHeader() {
  return (
    <HeadingBox>
      <Columns spacing={1} layout={[3, 6, 3]}>
        <TypeSelect />
        <Box>
          <AddButton />
          <GridButton />
        </Box>
        <SearchInput />
      </Columns>
    </HeadingBox>
  )
}

function ItemHeader() {
  return (
    <HeadingBox variant="h6">
      <Columns spacing={3}>
        <Columns spacing={1}>
          <BackButton />
          <ItemSelect />
        </Columns>
        <Box>
          <RemoveButton />
          <ModeButton />
        </Box>
      </Columns>
    </HeadingBox>
  )
}

function TypeSelect() {
  const elementType = useStore((state) => state.elementType)
  const setElementType = useStore((state) => state.setElementType)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <HeadingSelector
      select
      fullWidth
      label="Select"
      margin="none"
      value={elementType}
      onChange={(ev) => {
        setElementType(ev.target.value)
        setElementIndex()
      }}
    >
      <MenuItem value="field">Fields</MenuItem>
      <MenuItem value="foreignKey">Foreign Keys</MenuItem>
    </HeadingSelector>
  )
}

export function ItemSelect() {
  const descriptor = useStore((state) => state.descriptor)
  const elementType = useStore((state) => state.elementType)
  const elementIndex = useStore((state) => state.elementIndex)
  const setElementIndex = useStore((state) => state.setElementIndex)
  // TODO: remove
  if (elementType !== 'field') return null
  if (elementIndex === undefined) return null
  return (
    <HeadingSelector
      select
      fullWidth
      label="Select"
      type="number"
      value={elementIndex}
      onChange={(ev) => setElementIndex(parseInt(ev.target.value))}
    >
      {descriptor.fields.map((field, index) => (
        <MenuItem key={index} value={index}>
          {field.name}
        </MenuItem>
      ))}
    </HeadingSelector>
  )
}

function AddButton() {
  const elementType = useStore((state) => state.elementType)
  const addElement = useStore((state) => state.addElement)
  return (
    <Button color="info" title="Add a new field" onClick={() => addElement()}>
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
      title="Toggle grid view"
    >
      Grid View
    </Button>
  )
}

function BackButton() {
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <HeadingButton
      fullWidth
      color="info"
      variant="outlined"
      onClick={() => setElementIndex()}
      title="Return to fields"
    >
      Fields
    </HeadingButton>
  )
}

function RemoveButton() {
  const elementType = useStore((state) => state.elementType)
  const removeElement = useStore((state) => state.removeElement)
  return (
    <Button title="Remove field" color="info" onClick={() => removeElement()}>
      Remove {elementType === 'field' ? 'Field' : 'Foreign Key'}
    </Button>
  )
}

function ModeButton() {
  const isElementExtra = useStore((state) => state.isElementExtra)
  const toggleIsElementExtra = useStore((state) => state.toggleIsElementExtra)
  return (
    <Button
      color={isElementExtra ? 'warning' : 'info'}
      onClick={() => toggleIsElementExtra()}
      title="Toggle constraints view"
    >
      Constraints
    </Button>
  )
}

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
        height: '100%',
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
  const elementIndex = useStore((state) => state.elementIndex)
  const isElementExtra = useStore((state) => state.isElementExtra)
  switch (elementType) {
    case 'field':
      if (elementIndex === undefined) return <Fields />
      if (isElementExtra) return <Constraints />
      return <Field />
    case 'foreignKey':
      if (elementIndex === undefined) return <ForeignKeys />
      return <ForeignKey />
    default:
      return null
  }
}
