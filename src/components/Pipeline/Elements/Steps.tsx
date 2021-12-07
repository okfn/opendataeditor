import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import ItemButton from '../../Library/Buttons/ItemButton'
import Box from '@mui/material/Box'
import { useStore, selectors } from '../store'

// TODO: restyle scrolls (use Table's style)

export default function Steps() {
  const theme = useTheme()
  const foundStepItems = useStore(selectors.foundStepItems)
  return (
    <Box sx={{ height: theme.spacing(40), overflowY: 'auto' }}>
      {foundStepItems.length ? <FoundItems /> : <NotFoundItems />}
    </Box>
  )
}

function FoundItems() {
  const foundStepItems = useStore(selectors.foundStepItems)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <React.Fragment>
      {foundStepItems.map(({ index, step }) => (
        <ItemButton
          key={index}
          index={index}
          name={step.code}
          type="step"
          isGrid={isElementGrid}
          onClick={() => setElementIndex(index)}
          title="View step"
        />
      ))}
    </React.Fragment>
  )
}

function NotFoundItems() {
  const steps = useStore((state) => state.descriptor.steps)
  const elementQuery = useStore((state) => state.elementQuery)
  const message = steps && steps.length && elementQuery ? 'found' : 'added'
  return <ItemButton disabled name={`No extra steps ${message}`} />
}
