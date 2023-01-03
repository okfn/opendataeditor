import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import ItemButton from '../../Library/Buttons/ItemButton'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../store'

// TODO: restyle scrolls (use Table's style)

export default function Fields() {
  const theme = useTheme()
  const foundFieldItems = useStore(selectors.foundFieldItems)
  return (
    <Box
      sx={{
        height: theme.spacing(34),
        maxHeight: theme.spacing(34),
        overflowY: 'scroll',
      }}
      className="boxScrollable"
    >
      {foundFieldItems.length ? <FoundItems /> : <NotFoundItems />}
    </Box>
  )
}

function FoundItems() {
  const foundFieldItems = useStore(selectors.foundFieldItems)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <>
      {foundFieldItems.map(({ index, field }) => (
        <ItemButton
          key={index}
          index={index}
          name={field.name}
          type={field.type}
          isGrid={isElementGrid}
          onClick={() => setElementIndex(index)}
          title="View field"
        />
      ))}
    </>
  )
}

function NotFoundItems() {
  const fields = useStore((state) => state.descriptor.fields)
  const elementQuery = useStore((state) => state.elementQuery)
  const message = fields.length && elementQuery ? 'found' : 'added'
  return <ItemButton disabled name={`No fields ${message}`} />
}
