import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import ItemButton from '../../Library/Buttons/ItemButton'
import HeadingBox from '../../Library/Groups/HeadingBox'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../store'

// TODO: restyle scrolls (use Table's style)

export default function Resources() {
  const theme = useTheme()
  const foundResourceItems = useStore(selectors.foundResourceItems)
  return (
    <Box sx={{ height: theme.spacing(40), overflowY: 'auto' }}>
      <HeadingBox>Resources</HeadingBox>
      {foundResourceItems.length ? <FoundItems /> : <NotFoundItems />}
    </Box>
  )
}

function FoundItems() {
  const foundResourceItems = useStore(selectors.foundResourceItems)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <React.Fragment>
      {foundResourceItems.map(({ index, resource }) => (
        <ItemButton
          key={index}
          index={index}
          name={resource.name}
          type={resource.type}
          isGrid={isElementGrid}
          onClick={() => setElementIndex(index)}
          title="View resource"
        />
      ))}
    </React.Fragment>
  )
}

function NotFoundItems() {
  const resources = useStore((state) => state.descriptor.resources)
  const elementQuery = useStore((state) => state.elementQuery)
  const message = resources && resources.length && elementQuery ? 'found' : 'added'
  return <ItemButton disabled name={`No extra resources ${message}`} />
}
