import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import MenuTree from '../../Parts/Trees/Menu'
import EditorHelp from '../Base/Help'
import SelectField from '../../Parts/Fields/Select'
import Columns from '../../Parts/Grids/Columns'
import Resource from '../Resource'
import Dialect from '../Dialect'
import Schema from '../Schema'
import PackageSection from './Sections/Package'
import LicenseSection from './Sections/License'
import ResourceSection from './Sections/Resource'
import SourceSection from './Sections/Source'
import ContributorSection from './Sections/Contributor'
import { useStore, selectors, select } from './store'
import * as types from '../../../types'

export default function Layout() {
  return (
    <Box sx={{ height: '100%' }}>
      <LayoutWithMenu />
    </Box>
  )
}

// TODO: improve menu implementation (move some state to store / reduce re-renders)
function LayoutWithMenu() {
  const section = useStore((state) => state.section)
  const resource = useStore(selectors.resource)
  const format = useStore(select(selectors.resource, (resource) => resource.format))
  const dialect = useStore(select(selectors.resource, (resource) => resource.dialect))
  const schema = useStore(select(selectors.resource, (resource) => resource.schema))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const updateResource = useStore((state) => state.updateResource)

  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'package', name: 'Package' },
    { section: 'package/resource', name: 'Resources' },
    { section: 'package/license', name: 'Licenses' },
    { section: 'package/contributor', name: 'Contributors' },
    { section: 'package/source', name: 'Sources' },
    { section: 'resource', name: 'Resource' },
    { section: 'resource/checksum', name: 'Checksum' },
    { section: 'resource/license', name: 'Licenses' },
    { section: 'resource/contributor', name: 'Contributors' },
    { section: 'resource/source', name: 'Sources' },
    { section: 'dialect', name: 'Dialect', disabled: resource.type !== 'table' },
    { section: 'dialect/format', name: capitalize(format) || 'Format' },
    { section: 'schema', name: 'Schema', disabled: resource.type !== 'table' },
    { section: 'schema/field', name: 'Fields' },
    { section: 'schema/foreignKey', name: 'Foreign Keys' },
  ]

  // We use memo to avoid nested editors re-rerender
  const handleResourceChange = React.useMemo(() => {
    return (resource: types.IResource) => updateResource(resource)
  }, [])
  const handleDialectChange = React.useMemo(() => {
    return (dialect: types.IDialect) => updateResource({ dialect })
  }, [])
  const handleSchemaChange = React.useMemo(() => {
    return (schema: types.ISchema) => updateResource({ schema })
  }, [])

  // We use memo to avoid nested editors re-rerender
  const externalMenu = React.useMemo(() => {
    return { section }
  }, [])
  React.useEffect(() => {
    const isTabular = section.startsWith('dialect') || section.startsWith('schema')
    if (resource.type !== 'table' && isTabular) {
      updateHelp('resource')
      updateState({ section: 'resource' })
      externalMenu.section = 'resource'
    }
  }, [resource])

  return (
    <Columns spacing={3} layout={[2, 8]} columns={10}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <Box
          sx={{
            borderBottom: 'dashed 1px #ddd',
            paddingBottom: 1.5,
            marginBottom: 1.5,
          }}
        >
          <ResourceSelector />
        </Box>
        <MenuTree
          menuItems={MENU_ITEMS}
          selected={section}
          defaultExpanded={['package']}
          onSelect={(section) => {
            updateHelp(section)
            updateState({ section })
            externalMenu.section = section
          }}
        />
      </Box>
      <Box>
        <Box hidden={!section.startsWith('package')}>
          <LayoutWithoutMenu />
        </Box>
        <Box hidden={!section.startsWith('resource')}>
          <Resource
            resource={resource}
            externalMenu={externalMenu}
            onChange={handleResourceChange}
          />
        </Box>
        {resource.type === 'table' && (
          <Box>
            <Box hidden={!section.startsWith('dialect')}>
              <Dialect
                format={format}
                dialect={dialect}
                externalMenu={externalMenu}
                onChange={handleDialectChange}
              />
            </Box>
            <Box hidden={!section.startsWith('schema')}>
              <Schema
                schema={schema}
                externalMenu={externalMenu}
                onChange={handleSchemaChange}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Columns>
  )
}

function LayoutWithoutMenu() {
  const section = useStore((state) => state.section)
  const helpItem = useStore((state) => state.helpItem)
  if (!section) return null
  return (
    <Columns spacing={3} layout={[5, 3]} columns={8}>
      <Box>
        <Box hidden={section !== 'package'}>
          <PackageSection />
        </Box>
        <Box hidden={section !== 'package/resource'}>
          <ResourceSection />
        </Box>
        <Box hidden={section !== 'package/license'}>
          <LicenseSection />
        </Box>
        <Box hidden={section !== 'package/contributor'}>
          <ContributorSection />
        </Box>
        <Box hidden={section !== 'package/source'}>
          <SourceSection />
        </Box>
      </Box>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}

export function ResourceSelector() {
  const resource = useStore(selectors.resource)
  const updateResourceState = useStore((state) => state.updateResourceState)
  const resourceNames = useStore(selectors.resourceNames)
  if (!resource) return null
  return (
    <SelectField
      margin="none"
      label="Resource"
      value={resource.name}
      options={resourceNames}
      onChange={(value) => updateResourceState({ index: resourceNames.indexOf(value) })}
    />
  )
}
