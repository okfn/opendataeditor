import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../Library/Tabs'
import Resource from '../Resource'
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
  const isTable = useStore((state) => state.descriptor.resources[0]?.type === 'table')
  if (!withTabs) return <LayoutDefault />
  if (!isTable) return <LayoutWithTabs />
  return <LayoutWithTabsTable />
}

function LayoutDefault() {
  const theme = useTheme()
  return (
    <Box
      sx={{
        height: theme.spacing(50),
      }}
    >
      <Box
        sx={{
          height: theme.spacing(42),
        }}
      >
        <Content />
      </Box>
      <Box sx={{ height: theme.spacing(8) }}>
        <Actions />
      </Box>
    </Box>
  )
}

export function LayoutWithTabs() {
  return (
    <Tabs labels={['Package']}>
      <LayoutDefault />
    </Tabs>
  )
}

export function LayoutWithTabsTable() {
  const update = useStore((state) => state.update)
  const resource = useStore((state) => state.descriptor.resources[0])
  const dialect = useStore((state) => state.descriptor.resources[0]?.dialect)
  const schema = useStore((state) => state.descriptor.resources[0]?.schema)
  const checklist = useStore((state) => state.descriptor.resources[0]?.checklist)
  const pipeline = useStore((state) => state.descriptor.resources[0]?.pipeline)
  return (
    <Tabs labels={['Package', 'Resource', 'Dialect', 'Schema', 'Checklist', 'Pipeline']}>
      <LayoutDefault />
      <Resource
        resource={resource}
        onCommit={(resource) => update({ resoures: [resource] })}
      />
      <Dialect
        dialect={dialect}
        onCommit={(dialect) => update({ resources: [{ ...resource, dialect }] })}
      />
      <Schema
        schema={schema}
        onCommit={(schema) => update({ resources: [{ ...resource, schema }] })}
      />
      <Checklist
        checklist={checklist}
        schema={schema}
        onCommit={(checklist) => update({ resources: [{ ...resource, checklist }] })}
      />
      <Pipeline
        pipeline={pipeline}
        schema={schema}
        onCommit={(pipeline) => update({ resources: [{ ...resource, pipeline }] })}
      />
    </Tabs>
  )
}
