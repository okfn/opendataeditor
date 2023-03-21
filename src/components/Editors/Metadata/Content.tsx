import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Package from '../Package2'
import Resource from '../Resource2'
import Dialect from '../Dialect2'
import Schema from '../Schema2'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const type = useStore((state) => state.editorState.type)
  const height = `calc(100vh - ${theme.spacing(8 + 8)})`
  return <Box sx={{ height }}>{type ? <Editor /> : <Welcome />}</Box>
}

function Editor() {
  const type = useStore((state) => state.editorState.type)
  switch (type) {
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
  return <div>welcome</div>
}
