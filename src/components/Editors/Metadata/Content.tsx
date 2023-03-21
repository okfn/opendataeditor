import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Package from '../Package2'
import Resource from '../Resource2'
import Dialect from '../Dialect2'
import Schema from '../Schema2'
import CardButton from '../../Parts/Buttons/CardButton'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const editor = useStore((state) => state.editorState.editor)
  const height = `calc(100vh - ${theme.spacing(8 + 8)})`
  return <Box sx={{ height }}>{editor ? <Editor /> : <Welcome />}</Box>
}

function Editor() {
  const editor = useStore((state) => state.editorState.editor)
  switch (editor) {
    case 'package':
      return <Package />
    case 'resource':
      return <Resource />
    case 'dialect':
      return <Dialect />
    case 'schema':
      return <Schema />
    default:
      return null
  }
}

function Welcome() {
  const updateEditorState = useStore((state) => state.updateEditorState)
  return (
    <Stack spacing={3} sx={{ padding: 3, height: '100%' }}>
      <Stack direction="row" spacing={3} height="100%">
        <CardButton
          label="Package"
          text="A simple container format for describing a coherent collection of data in a single 'package'. It provides the basis for convenient delivery, installation and management of datasets."
          link="https://specs.frictionlessdata.io/data-package/"
          onClick={() => updateEditorState({ editor: 'package' })}
        />
        <CardButton
          label="Resource"
          text="The Data Resource format describes a data resource such as an individual file or table. The essence of a Data Resource is a locator for the data it describes"
          link="https://specs.frictionlessdata.io/data-resource/"
          onClick={() => updateEditorState({ editor: 'resource' })}
        />
      </Stack>
      <Stack direction="row" spacing={3} height="100%">
        <CardButton
          label="Dialect"
          text="Dialect is a core Frictionless Data concept meaning a metadata information regarding tabular data source. The Table Dialect concept give us an ability to manage table header and any details related to specific formats"
          link="https://framework.frictionlessdata.io/docs/framework/dialect.html"
          onClick={() => updateEditorState({ editor: 'dialect' })}
        />
        <CardButton
          label="Schema"
          text="Table Schema is a simple language- and implementation-agnostic way to declare a schema for tabular data. Table Schema is well suited for use cases around handling and validating tabular data "
          link="https://specs.frictionlessdata.io/table-schema/"
          onClick={() => updateEditorState({ editor: 'schema' })}
        />
      </Stack>
    </Stack>
  )
}
