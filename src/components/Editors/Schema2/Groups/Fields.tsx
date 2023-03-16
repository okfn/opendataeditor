import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../../../Parts/Columns'
import ItemButton from '../../../Parts/Buttons/ItemButton'
import HeadingBox from '../../../Parts/Groups/HeadingBox'
import HeadingSearch from '../../../Parts/Groups/HeadingSearch'
import { useStore, selectors } from '../store'

export default function Fields() {
  const foundFieldItems = useStore(selectors.foundFieldItems)
  return (
    <React.Fragment>
      <HeadingBox>
        <Columns spacing={1} layout={[6, 3, 3]}>
          <Box>Fields</Box>
          <Columns spacing={1}>
            <AddButton />
            <GridButton />
          </Columns>
          <SearchInput />
        </Columns>
      </HeadingBox>
      {foundFieldItems.length ? <FoundItems /> : <NotFoundItems />}
    </React.Fragment>
  )
}

function AddButton() {
  const schema = useStore((state) => state.schema)
  const updateSchema = useStore((state) => state.updateSchema)
  return (
    <Button
      color="info"
      title={`Add a new field`}
      onClick={() => {
        console.log('Add field!')
      }}
    >
      Add Field
    </Button>
  )
}

function GridButton() {
  const isGrid = useStore((state) => state.fieldInfo.isGrid)
  const fieldInfo = useStore((state) => state.fieldInfo)
  const updateFieldInfo = useStore((state) => state.updateFieldInfo)
  return (
    <Button
      color={isGrid ? 'warning' : 'info'}
      onClick={() => {
        fieldInfo.isGrid = !fieldInfo.isGrid
        updateFieldInfo(fieldInfo)
      }}
      title="Toggle grid view"
    >
      Grid View
    </Button>
  )
}

function SearchInput() {
  const query = useStore((state) => state.fieldInfo.query)
  const fieldInfo = useStore((state) => state.fieldInfo)
  const updateFieldInfo = useStore((state) => state.updateFieldInfo)
  return (
    <HeadingSearch
      value={query}
      onChange={(query) => {
        fieldInfo.query = query
        updateFieldInfo(fieldInfo)
      }}
    />
  )
}

function FoundItems() {
  const foundFieldItems = useStore(selectors.foundFieldItems)
  const isGrid = useStore((state) => state.fieldInfo.isGrid)
  const fieldInfo = useStore((state) => state.fieldInfo)
  const updateFieldInfo = useStore((state) => state.updateFieldInfo)
  return (
    <>
      {foundFieldItems.map(({ index, field }) => (
        <ItemButton
          key={index}
          index={index}
          name={field.name}
          type={field.type}
          isGrid={isGrid}
          onClick={() => {
            fieldInfo.index = index
            updateFieldInfo(fieldInfo)
          }}
          title="View Field"
        />
      ))}
    </>
  )
}

function NotFoundItems() {
  const fields = useStore((state) => state.schema.fields)
  const query = useStore((state) => state.fieldInfo.query)
  const message = fields.length && query ? 'found' : 'added'
  return <ItemButton disabled name={`No fields ${message}`} />
}
