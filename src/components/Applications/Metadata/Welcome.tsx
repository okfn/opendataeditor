import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import CardButton from '../../Parts/Buttons/Card'
import ScrollBox from '../../Parts/ScrollBox'
import { useStore } from './store'

export default function Welcome() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8)})`
  const updateState = useStore((state) => state.updateState)
  return (
    <ScrollBox height={{ height }}>
      <Stack spacing={3} sx={{ padding: 3, height: '100%' }}>
        <Stack direction="row" spacing={3} height="100%">
          <CardButton
            label="Package"
            text="A simple container format for describing a coherent collection of data in a single 'package'. It provides the basis for convenient delivery, installation and management of datasets."
            link="https://specs.frictionlessdata.io/data-package/"
            onClick={() => updateState({ editor: 'package' })}
          />
          <CardButton
            label="Resource"
            text="The Data Resource format describes a data resource such as an individual file or table. The essence of a Data Resource is a locator for the data it describes"
            link="https://specs.frictionlessdata.io/data-resource/"
            onClick={() => updateState({ editor: 'resource' })}
          />
        </Stack>
        <Stack direction="row" spacing={3} height="100%">
          <CardButton
            label="Dialect"
            text="Dialect is a core Frictionless Data concept meaning a metadata information regarding tabular data source. The Table Dialect concept give us an ability to manage table header and any details related to specific formats"
            link="https://framework.frictionlessdata.io/docs/framework/dialect.html"
            onClick={() => updateState({ editor: 'dialect' })}
          />
          <CardButton
            label="Schema"
            text="Table Schema is a simple language- and implementation-agnostic way to declare a schema for tabular data. Table Schema is well suited for use cases around handling and validating tabular data "
            link="https://specs.frictionlessdata.io/table-schema/"
            onClick={() => updateState({ editor: 'schema' })}
          />
        </Stack>
      </Stack>
    </ScrollBox>
  )
}
