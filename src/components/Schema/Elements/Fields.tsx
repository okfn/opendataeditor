import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import ItemButton from '../../Library/Buttons/ItemButton'
import Box from '@mui/material/Box'
import { useStore } from '../store'

export default function Fields() {
  const theme = useTheme()
  const fields = useStore((state) => state.descriptor.fields)
  const elementQuery = useStore((state) => state.elementQuery)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <Box sx={{ height: theme.spacing(40), overflowY: 'auto' }}>
      {fields.map(
        (field, index) =>
          (!elementQuery || field.name.includes(elementQuery)) && (
            <ItemButton
              key={index}
              index={index}
              name={field.name}
              type={field.type}
              isGrid={isElementGrid}
              onClick={() => setElementIndex(index)}
            />
          )
      )}
    </Box>
  )
}
