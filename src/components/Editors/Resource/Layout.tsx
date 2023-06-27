import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import EditorHelp from '../Base/Help'
import HorizontalTabs from '../../Parts/Tabs/Horizontal'
import VerticalTabs from '../../Parts/Tabs/Vertical'
import Dialect from '../Dialect'
import Schema from '../Schema'
import Resource from './Sections/Resource'
import Checksum from './Sections/Checksum'
import License from './Sections/License'
import { useStore } from './store'
import Source from './Sections/Source'
import Contributor from './Sections/Contributor'

const LABELS = ['Resource', 'Checksum', 'Licenses', 'Sources', 'Contributors']

export default function Layout() {
  const theme = useTheme()
  const shallow = useStore((state) => state.shallow)
  return (
    <Box sx={{ height: theme.spacing(42) }}>{shallow ? <Sections /> : <Groups />}</Box>
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
        <Source />
        <Contributor />
      </VerticalTabs>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}

function Groups() {
  const dialect = useStore((state) => state.descriptor.dialect)
  const schema = useStore((state) => state.descriptor.schema)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const format = useStore((state) => state.descriptor.format)
  const onFieldSelected = useStore((state) => state.onFieldSelected)
  return (
    <HorizontalTabs labels={['Resource', 'Dialect', 'Schema']}>
      <Sections />
      <Dialect
        format={format}
        dialect={dialect}
        onChange={(dialect) => updateDescriptor({ dialect })}
      />
      <Schema
        schema={schema}
        onChange={(schema) => updateDescriptor({ schema })}
        onFieldSelected={onFieldSelected}
      />
    </HorizontalTabs>
  )
}
