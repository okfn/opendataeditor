import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import Tabs from '../../Parts/Tabs'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/VerticalTabs'
import EditorHelp from '../../Parts/Editor/EditorHelp'
import SelectField from '../../Parts/Fields/SelectField'
import Resource from '../Resource2'
import Dialect from '../Dialect2'
import Schema from '../Schema2'
import Package from './Sections/Package'
import License from './Sections/License'
import Resources from './Sections/Resource'
import { useStore, selectors } from './store'

const LABELS = ['Package', 'Resources', 'Licenses']

export default function Layout() {
  const theme = useTheme()
  const isShallow = useStore((state) => state.isShallow)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      {isShallow ? <Sections /> : <Groups />}
      <Selector />
    </Box>
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
        <Package />
        <Resources />
        <License />
      </VerticalTabs>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}

function Groups() {
  const resource = useStore((state) => state.descriptor.resources[0])
  const dialect = useStore((state) => state.descriptor.resources[0]?.dialect)
  const schema = useStore((state) => state.descriptor.resources[0]?.schema)
  // const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <Tabs labels={['Package', 'Resource', 'Dialect', 'Schema']}>
      <Sections />
      <Resource isShallow resource={resource} onChange={() => {}} />
      <Dialect dialect={dialect} onChange={() => {}} />
      <Schema schema={schema} onChange={() => {}} />
    </Tabs>
  )
}

function Selector() {
  const updateResourceState = useStore((state) => state.updateResourceState)
  const helpItem = useStore((state) => state.helpItem)
  const index = useStore((state) => state.resourceState.index)
  const resourceNames = useStore(selectors.resourceNames)
  if (helpItem.path.startsWith('package')) return null
  if (resourceNames.length < 2) return null
  if (index === undefined) return null
  return (
    <Box sx={{ position: 'absolute', top: 3, right: 3, width: '40%' }}>
      <SelectField
        color="success"
        focused
        margin="none"
        value={resourceNames[index]}
        options={resourceNames}
        onChange={(value) => updateResourceState({ index: resourceNames.indexOf(value) })}
        InputProps={{
          startAdornment: <InputAdornment position="start">Resource:</InputAdornment>,
        }}
      />
    </Box>
  )
}
