import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../../Parts/Tabs'
import Dialect from '../Dialect'
import Schema from '../Schema'
import Checklist from '../Checklist'
import Pipeline from '../Pipeline'
import Actions from './Actions'
import Content from './Content'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Layout() {
  const withTabs = useStore((state) => state.withTabs)
  const isTable = useStore((state) => state.descriptor.type === 'table')
  if (!withTabs) return <LayoutDefault />
  if (!isTable) return <LayoutWithTabs />
  return <LayoutWithTabsTable />
}

function LayoutDefault() {
  const theme = useTheme()
  return (
    <Box sx={{ height: theme.spacing(50) }}>
      <Box sx={{ height: theme.spacing(42) }}>
        <Content />
      </Box>
      <Box sx={{ height: theme.spacing(8) }}>
        <Actions />
      </Box>
    </Box>
  )
}

function LayoutWithTabs() {
  return (
    <Tabs labels={['Resource']}>
      <LayoutDefault />
    </Tabs>
  )
}

function LayoutWithTabsTable() {
  const update = useStore((state) => state.update)
  const dialect = useStore((state) => state.descriptor.dialect)
  const schema = useStore((state) => state.descriptor.schema)
  const checklist = useStore((state) => state.descriptor.checklist)
  const pipeline = useStore((state) => state.descriptor.pipeline)
  const updateColumn = useStore((state) => state.updateColumn)
  return (
    <Tabs index={2} labels={['Resource', 'Dialect', 'Schema', 'Checklist', '_Pipeline']}>
      <LayoutDefault />
      <Dialect dialect={dialect} onCommit={(dialect) => update({ dialect })} />
      <Schema
        schema={schema}
        onCommit={(schema) => update({ schema })}
        onChangeColumn={(selectedColumn) => updateColumn(selectedColumn)}
      />
      <Checklist
        checklist={checklist}
        schema={schema}
        onCommit={(checklist) => update({ checklist })}
      />
      <Pipeline
        pipeline={pipeline}
        schema={schema}
        onCommit={(pipeline) => update({ pipeline })}
      />
    </Tabs>
  )
}
