import * as React from 'react'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useStore } from '../store'

export default function ForeignKeys() {
  const descriptor = useStore((state) => state.descriptor)
  const elementQuery = useStore((state) => state.elementQuery)
  const isElementGrid = useStore((state) => state.isElementGrid)
  const setElementIndex = useStore((state) => state.setElementIndex)
  const setElementType = useStore((state) => state.setElementType)
  const foreignKeys = elementQuery
    ? (descriptor.foreignKeys || []).filter((k) => (k.name || '').includes(elementQuery))
    : descriptor.foreignKeys || []
  return (
    <FormControl fullWidth>
      <Box sx={{ maxHeight: '310px', overflowY: 'auto' }}>
        {foreignKeys.map((fk, index) => (
          <Button
            size="large"
            color="info"
            variant="outlined"
            endIcon="FK"
            onClick={() => {
              setElementIndex(index)
              setElementType('foreignKey')
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
            {fk.name}
          </Button>
        ))}
      </Box>
    </FormControl>
  )
}
