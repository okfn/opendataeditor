import * as React from 'react'
import ItemButton from '../../Library/Buttons/ItemButton'
import Box from '@mui/material/Box'
import { useStore } from '../store'

export default function Fields() {
  const descriptor = useStore((state) => state.descriptor)
  const elementQuery = useStore((state) => state.elementQuery)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  const fields = elementQuery
    ? descriptor.fields.filter((field) => field.name.includes(elementQuery))
    : descriptor.fields
  return (
    <Box sx={{ height: '320px', overflowY: 'auto' }}>
      {fields.map((field, index) => (
        <ItemButton
          key={index}
          index={index}
          name={field.name}
          type={field.type}
          isGrid={isElementGrid}
          onClick={() => setElementIndex(index)}
        />
      ))}
    </Box>
  )
}
