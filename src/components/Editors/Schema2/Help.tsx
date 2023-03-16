import * as React from 'react'
import Box from '@mui/material/Box'
import HelpCard from '../../Parts/HelpCard'

export default function Help() {
  return (
    <Box sx={{ paddingTop: 2, paddingRight: 2, height: '100%' }}>
      <HelpCard
        title="Schema"
        subtitle="overview"
        link="https://framework.frictionlessdata.io/docs/guides/describing-data#describing-a-schema"
      >
        Table Schema is a specification for providing a schema for tabular data. It
        includes the expected data type for each value in a column.
      </HelpCard>
    </Box>
  )
}
