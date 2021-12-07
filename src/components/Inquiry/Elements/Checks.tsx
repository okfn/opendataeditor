import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import ItemButton from '../../Library/Buttons/ItemButton'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../store'

// TODO: restyle scrolls (use Table's style)

export default function Checks() {
  const theme = useTheme()
  const foundCheckItems = useStore(selectors.foundCheckItems)
  return (
    <Box sx={{ height: theme.spacing(40), overflowY: 'auto' }}>
      {foundCheckItems.length ? <FoundItems /> : <NotFoundItems />}
    </Box>
  )
}

function FoundItems() {
  const foundCheckItems = useStore(selectors.foundCheckItems)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <React.Fragment>
      {foundCheckItems.map(({ index, check }) => (
        <ItemButton
          key={index}
          index={index}
          name={check.code}
          type="check"
          isGrid={isElementGrid}
          onClick={() => setElementIndex(index)}
          title="View check"
        />
      ))}
    </React.Fragment>
  )
}

function NotFoundItems() {
  const checks = useStore((state) => state.descriptor.checks)
  const elementQuery = useStore((state) => state.elementQuery)
  const message = checks && checks.length && elementQuery ? 'found' : 'exist'
  return <ItemButton disabled name={`No extra checks ${message}`} />
}
