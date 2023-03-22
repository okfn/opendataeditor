import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Tabs from '../../Parts/Tabs'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/VerticalTabs'
import EditorHelp from '../../Parts/Editor/EditorHelp'
import Dialect from '../Dialect'
import Schema from '../Schema'
import Resource from './Sections/Resource'
import Checksum from './Sections/Checksum'
import License from './Sections/License'
import { useStore } from './store'

const LABELS = ['Resource', 'Checksum', 'Licenses']

export default function Layout() {
  const theme = useTheme()
  const isShallow = useStore((state) => state.isShallow)
  return (
    <Box sx={{ height: theme.spacing(42) }}>{isShallow ? <Sections /> : <Groups />}</Box>
  )
}

function Sections() {
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <Columns spacing={3} layout={[9, 3]}>
      <VerticalTabs
        labels={LABELS}
        onChange={(index) => updateHelp(camelCase(LABELS[index]))}
      >
        <Resource />
        <Checksum />
        <License />
      </VerticalTabs>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}

function Groups() {
  const dialect = useStore((state) => state.descriptor.dialect)
  const schema = useStore((state) => state.descriptor.schema)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  console.log('draw')
  return (
    <Tabs labels={['Resource', 'Dialect', 'Schema']}>
      <Sections />
      <Dialect dialect={dialect} onChange={(dialect) => updateDescriptor({ dialect })} />
      <Schema schema={schema} onChange={(schema) => updateDescriptor({ schema })} />
    </Tabs>
  )
}
