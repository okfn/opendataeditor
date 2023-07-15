import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import EditorHelp from '../Base/Help'
import HorizontalTabs from '../../Parts/Tabs/Horizontal'
import MenuPanel from '../../Parts/Panels/Menu'
import Dialect from '../Dialect'
import Schema from '../Schema'
import ResourceSection from './Sections/Resource'
import ChecksumSection from './Sections/Checksum'
import LicenseSection from './Sections/License'
import SourceSection from './Sections/Source'
import ContributorSection from './Sections/Contributor'
import { useStore } from './store'
import * as types from '../../../types'

export default function Layout() {
  const theme = useTheme()
  const shallow = useStore((state) => state.shallow)
  return (
    <Box sx={{ height: theme.spacing(42) }}>{shallow ? <Sections /> : <Groups />}</Box>
  )
}

function Sections() {
  const section = useStore((state) => state.section)
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'resource', name: 'Resource' },
    { section: 'resource/checksum', name: 'Checksum' },
    { section: 'resource/licenses', name: 'Licenses' },
    { section: 'resource/contributors', name: 'Contributors' },
    { section: 'resource/sources', name: 'Sources' },
  ]
  return (
    <Columns spacing={3} layout={[9, 3]}>
      <MenuPanel
        menuItems={MENU_ITEMS}
        selected={section}
        defaultExpanded={['resource']}
        onSelect={(section) => {
          updateHelp(section)
          updateState({ section })
        }}
      >
        <ResourceSection />
        <ChecksumSection />
        <LicenseSection />
        <ContributorSection />
        <SourceSection />
      </MenuPanel>
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
