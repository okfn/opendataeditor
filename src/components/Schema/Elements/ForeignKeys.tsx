import * as React from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import ItemButton from '../../Library/Buttons/ItemButton'
import { useStore } from '../store'

export default function ForeignKeys() {
  const descriptor = useStore((state) => state.descriptor)
  const elementQuery = useStore((state) => state.elementQuery)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  const foreignKeys = elementQuery
    ? (descriptor.foreignKeys || []).filter((fk) =>
        fk.field.join(',').includes(elementQuery)
      )
    : descriptor.foreignKeys || []
  return (
    <FormControl fullWidth>
      <Box sx={{ height: '320px', overflowY: 'auto' }}>
        {foreignKeys.map((fk, index) => (
          <ItemButton
            key={index}
            index={index}
            name={fk.field.join(',')}
            type={'fk'}
            isGrid={isElementGrid}
            onClick={() => setElementIndex(index)}
          />
        ))}
      </Box>
    </FormControl>
  )
}
