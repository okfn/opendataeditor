import * as React from 'react'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Box from '@mui/material/Box'
import { useStore } from '../store'

export default function Fields() {
  const descriptor = useStore((state) => state.descriptor)
  const elementQuery = useStore((state) => state.elementQuery)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  const setElementType = useStore((state) => state.setElementType)
  const fields = elementQuery
    ? descriptor.fields.filter((field) => field.name.includes(elementQuery))
    : descriptor.fields
  return (
    <FormControl fullWidth>
      <Box sx={{ maxHeight: '310px', overflowY: 'auto' }}>
        {fields.map((field, index) => (
          <Button
            size="large"
            color="info"
            variant="outlined"
            endIcon={isElementGrid ? null : field.type.toUpperCase()}
            onClick={() => {
              setElementIndex(index)
              setElementType('field')
            }}
            key={index}
            sx={{
              width: isElementGrid ? 'inherit' : '100%',
              marginRight: isElementGrid ? 2 : 0,
              justifyContent: 'space-between',
              textTransform: 'initial',
              p: [2, 2],
              mt: 2,
            }}
          >
            {field.name}
          </Button>
        ))}
      </Box>
    </FormControl>
  )
}
