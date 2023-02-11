import * as React from 'react'
import Box from '@mui/material/Box'
import MultilineField from '../../../Parts/Fields/MultilineField'
import BaseTree from '../../../Parts/Trees/BaseTree'
import Columns from '../../../Parts/Columns'
import { useStore } from '../store'

const EXAMPLE_TREE = [
  {
    name: 'Table 1',
    path: 'table1',
    type: 'table',
    children: [
      { name: 'Field 1', path: 'table1/field1', type: 'field', children: [] },
      { name: 'Field 2', path: 'table1/field2', type: 'field', children: [] },
    ],
  },
  {
    name: 'Table 2',
    path: 'table2',
    type: 'table',
    children: [
      { name: 'Field 1', path: 'table2/field1', type: 'field', children: [] },
      { name: 'Field 2', path: 'table2/field2', type: 'field', children: [] },
    ],
  },
]

export default function ConfigPanel() {
  const query = useStore((state) => state.query)
  const setQuery = useStore((state) => state.setQuery)
  return (
    <Columns spacing={2}>
      <MultilineField
        rows={12}
        label="Query"
        value={query}
        onChange={(query) => setQuery(query)}
      />
      <Box sx={{ marginY: 2, border: 'solid 1px #ddd' }}>
        <BaseTree tree={EXAMPLE_TREE} />
      </Box>
    </Columns>
  )
}
