import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import InputAdornment from '@mui/material/InputAdornment'
import HorizontalTabs from '../../Parts/Tabs/Horizontal'
import VerticalTabs from '../../Parts/Tabs/Vertical'
import EditorHelp from '../../Parts/Editor/EditorHelp'
import SelectField from '../../Parts/Fields/SelectField'
import Columns from '../../Parts/Columns'
import Resource from '../Resource'
import Dialect from '../Dialect'
import Schema from '../Schema'
import Package from './Sections/Package'
import License from './Sections/License'
import Resources from './Sections/Resource'
import { useStore, selectors } from './store'

const LABELS = ['Package', 'Resources', 'Licenses']

export default function Layout() {
  const theme = useTheme()
  const isShallow = useStore((state) => state.isShallow)
  return (
    <Box sx={{ height: theme.spacing(42), position: 'relative' }}>
      {isShallow ? <Sections /> : <Groups />}
      <Selector />
    </Box>
  )
}

function Sections() {
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  const vtabIndex = useStore((state) => state.vtabIndex)
  const updateState = useStore((state) => state.updateState)
  return (
    <Columns spacing={3} layout={[9, 3]}>
      <VerticalTabs
        index={vtabIndex}
        labels={LABELS}
        onChange={(index) => {
          updateHelp(camelCase(LABELS[index]))
          updateState({ vtabIndex: index })
        }}
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
  const resource = useStore(selectors.resource)
  const tabIndex = useStore((state) => state.tabIndex)
  const updateState = useStore((state) => state.updateState)
  const updateResource = useStore((state) => state.updateResource)
  return (
    <HorizontalTabs
      index={tabIndex}
      labels={['Package', 'Resource', 'Dialect', 'Schema']}
      disabledLabels={!resource ? ['Resource', 'Dialect', 'Schema'] : []}
      onChange={(index) => updateState({ tabIndex: index })}
    >
      <Sections />
      {resource && (
        <Resource
          isShallow
          resource={resource}
          onChange={(resource) => updateResource(resource)}
          onBackClick={() => updateState({ tabIndex: 0, vtabIndex: 1 })}
        />
      )}
      {resource && (
        <Dialect
          dialect={resource.dialect}
          onChange={(dialect) => updateResource({ dialect })}
        />
      )}
      {resource && (
        <Schema
          schema={resource.schema}
          onChange={(schema) => updateResource({ schema })}
        />
      )}
    </HorizontalTabs>
  )
}

function Selector() {
  const resource = useStore(selectors.resource)
  const updateResourceState = useStore((state) => state.updateResourceState)
  const tabIndex = useStore((state) => state.tabIndex)
  const resourceNames = useStore(selectors.resourceNames)
  if (tabIndex === 0) return null
  if (!resource) return null
  return (
    <Box sx={{ position: 'absolute', top: 3, right: 3, width: '50%' }}>
      <SelectField
        focused
        margin="none"
        value={resource.name}
        options={resourceNames}
        onChange={(value) => updateResourceState({ index: resourceNames.indexOf(value) })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" disableTypography>
              Resource:
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
}
