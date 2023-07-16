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

function LayoutWithMenu() {
  const section = useStore((state) => state.section)
  const resource = useStore(selectors.resource)
  const format = useStore(select(selectors.resource, (resource) => resource.format))
  const dialect = useStore(select(selectors.resource, (resource) => resource.dialect))
  const schema = useStore(select(selectors.resource, (resource) => resource.schema))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const updateResource = useStore((state) => state.updateResource)

  const PACKAGE_MENU_ITEMS: types.IMenuItem[] = [
    { section: 'package', name: 'Package' },
    { section: 'package/resource', name: 'Resources' },
    { section: 'package/license', name: 'Licenses' },
    { section: 'package/contributor', name: 'Contributors' },
    { section: 'package/source', name: 'Sources' },
  ]
  const RESOURCE_MENU_ITEMS: types.IMenuItem[] = [
    { section: 'resource', name: 'Resource' },
    { section: 'resource/checksum', name: 'Checksum' },
    { section: 'resource/license', name: 'Licenses' },
    { section: 'resource/contributor', name: 'Contributors' },
    { section: 'resource/source', name: 'Sources' },
  ]
  if (resource.type === 'table') {
    RESOURCE_MENU_ITEMS.push(
      ...[
        { section: 'dialect', name: 'Dialect' },
        { section: 'dialect/format', name: capitalize(format) || 'Format' },
        { section: 'schema', name: 'Schema' },
        { section: 'schema/field', name: 'Fields' },
        { section: 'schema/foreignKey', name: 'Foreign Keys' },
      ]
    )
  }

  // TODO: move to store?
  // We use memo to avoid nested editors re-rerender
  const externalMenu = React.useMemo(() => {
    return { section }
  }, [])
  const handleResourceChange = React.useMemo(() => {
    return (resource: types.IResource) => updateResource(resource)
  }, [])
  const handleDialectChange = React.useMemo(() => {
    return (dialect: types.IDialect) => updateResource({ dialect })
  }, [])
  const handleSchemaChange = React.useMemo(() => {
    return (schema: types.ISchema) => updateResource({ schema })
  }, [])

  return (
    <Columns spacing={3} layout={[2, 10]}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <MenuTree
          menuItems={PACKAGE_MENU_ITEMS}
          selected={section}
          defaultExpanded={['package']}
          onSelect={(section) => {
            updateHelp(section)
            updateState({ section })
            externalMenu.section = section
          }}
        />
        <Box
          sx={{
            borderTop: 'dashed 1px #ddd',
            borderBottom: 'dashed 1px #ddd',
            marginTop: 1,
            paddingTop: 2,
            paddingBottom: 2,
            marginBottom: 1,
          }}
        >
          <ResourceSelector />
        </Box>
        <MenuTree
          menuItems={RESOURCE_MENU_ITEMS}
          selected={section}
          defaultExpanded={resource.type !== 'table' ? ['resource'] : []}
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
    <Columns spacing={3} layout={[7, 3]} columns={10}>
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
