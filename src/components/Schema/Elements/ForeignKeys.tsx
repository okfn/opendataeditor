import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ItemButton from '../../Library/Buttons/ItemButton'
import { useStore } from '../store'

export default function ForeignKeys() {
  const theme = useTheme()
  const foreignKeys = useStore((state) => state.descriptor.foreignKeys)
  const elementQuery = useStore((state) => state.elementQuery)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <Box sx={{ height: theme.spacing(40), overflowY: 'auto' }}>
      {(foreignKeys || []).map(
        (fk, index) =>
          (!elementQuery || fk.field.join(',').includes(elementQuery)) && (
            <ItemButton
              key={index}
              index={index}
              name={fk.field.join(',')}
              type={'fk'}
              isGrid={isElementGrid}
              onClick={() => setElementIndex(index)}
            />
          )
      )}
    </Box>
  )
}
