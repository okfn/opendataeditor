import * as React from 'react'
import capitalize from 'lodash/capitalize'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import EditorHelp from '../Base/Help'
import MenuTree from '../../Parts/Trees/Menu'
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
  const externalMenu = useStore((state) => state.externalMenu)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      {!externalMenu ? <SectionsWithMenu /> : <SectionsWithoutMenu />}
    </Box>
  )
}

function SectionsWithMenu() {
  const shallow = useStore((state) => state.shallow)
  const section = useStore((state) => state.section)
  const type = useStore((state) => state.descriptor.type)
  const format = useStore((state) => state.descriptor.format)
  const dialect = useStore((state) => state.descriptor.dialect)
  const schema = useStore((state) => state.descriptor.schema)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const onFieldSelected = useStore((state) => state.onFieldSelected)
  const [externalMenu] = React.useState({ section })
  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'resource', name: 'Resource' },
    { section: 'resource/checksum', name: 'Checksum' },
    { section: 'resource/license', name: 'Licenses' },
    { section: 'resource/contributor', name: 'Contributors' },
    { section: 'resource/source', name: 'Sources' },
  ]
  if (!shallow) {
    MENU_ITEMS.push(
      ...[
        { section: 'dialect', name: 'Dialect' },
        { section: 'dialect/type', name: capitalize(type) || 'Type' },
        { section: 'dialect/format', name: capitalize(format) || 'Format' },
        { section: 'schema', name: 'Schema' },
        { section: 'schema/field', name: 'Fields' },
        { section: 'schema/foreignKey', name: 'Foreign Keys' },
      ]
    )
  }
  return (
    <Columns spacing={3} layout={[2, 10]}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <MenuTree
          menuItems={MENU_ITEMS}
          selected={section}
          defaultExpanded={shallow ? ['resource'] : []}
          onSelect={(section) => {
            updateHelp(section)
            updateState({ section })
            externalMenu.section = section
          }}
        />
      </Box>
      <Box>
        <Box hidden={!section.startsWith('resource')}>
          <SectionsWithoutMenu />
        </Box>
        {!shallow && (
          <Box>
            <Box hidden={!section.startsWith('dialect')}>
              <Dialect
                type={type}
                format={format}
                dialect={dialect}
                externalMenu={externalMenu}
                onChange={(dialect) => updateDescriptor({ dialect })}
              />
            </Box>
            <Box hidden={!section.startsWith('schema')}>
              <Schema
                schema={schema}
                externalMenu={externalMenu}
                onChange={(schema) => updateDescriptor({ schema })}
                onFieldSelected={onFieldSelected}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Columns>
  )
}

function SectionsWithoutMenu() {
  const section = useStore((state) => state.section)
  const helpItem = useStore((state) => state.helpItem)
  if (!section) return null
  return (
    <Columns spacing={3} layout={[7, 3]} columns={10}>
      <Box>
        <Box hidden={section !== 'resource'}>
          <ResourceSection />
        </Box>
        <Box hidden={section !== 'resource/checksum'}>
          <ChecksumSection />
        </Box>
        <Box hidden={section !== 'resource/license'}>
          <LicenseSection />
        </Box>
        <Box hidden={section !== 'resource/contributor'}>
          <ContributorSection />
        </Box>
        <Box hidden={section !== 'resource/source'}>
          <SourceSection />
        </Box>
      </Box>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}
