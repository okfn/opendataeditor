import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ItemButton from '../../../Parts/Buttons/ItemButton'
import { useStore, selectors } from '../store'

// TODO: restyle scrolls (use Table's style)

export default function ForeignKeys() {
  const theme = useTheme()
  const foundForeignKeyItems = useStore(selectors.foundForeignKeyItems)
  return (
    <Box
      sx={{
        height: theme.spacing(34),
        maxHeight: theme.spacing(34),
        overflowY: 'auto',
      }}
    >
      {foundForeignKeyItems.length ? <FoundItems /> : <NotFoundItems />}
    </Box>
  )
}

function FoundItems() {
  const foundForeignKeyItems = useStore(selectors.foundForeignKeyItems)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <React.Fragment>
      {foundForeignKeyItems.map(({ index, foreignKey }) => (
        <ItemButton
          key={index}
          index={index}
          name={foreignKey.fields.join(',')}
          type={'fk'}
          isGrid={isElementGrid}
          onClick={() => setElementIndex(index)}
          title="View foreign key"
        />
      ))}
    </React.Fragment>
  )
}

function NotFoundItems() {
  const foreignKeys = useStore((state) => state.descriptor.foreignKeys)
  const elementQuery = useStore((state) => state.elementQuery)
  const message = (foreignKeys || []).length && elementQuery ? 'found' : 'added'
  return <ItemButton disabled name={`No foreign keys ${message}`} />
}
