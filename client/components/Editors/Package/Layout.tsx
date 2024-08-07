import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuTree from '../../Parts/Trees/Menu'
import EditorHelp from '../Base/Help'
import SelectField from '../../Parts/Fields/Select'
import Resource from '../Resource'
import Dialect from '../Dialect'
import Schema from '../Schema'
import PackageSection from './Sections/Package'
import LicensesSection from './Sections/Licenses'
import ResourcesSection from './Sections/Resources'
import SourcesSection from './Sections/Sources'
import ContributorsSection from './Sections/Contributors'
import { useStore, selectors, select } from './store'
import * as types from '../../../types'

export default function Layout() {
  return <LayoutWithMenu />
}

// TODO: improve menu implementation (move some state to store / reduce re-renders)
function LayoutWithMenu() {
  const shallow = useStore((state) => state.shallow)
  const section = useStore((state) => state.section)
  const resource = useStore(selectors.resource)
  const format = useStore(select(selectors.resource, (resource) => resource.format))
  const dialect = useStore(select(selectors.resource, (resource) => resource.dialect))
  const schema = useStore(select(selectors.resource, (resource) => resource.schema))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const updateResource = useStore((state) => state.updateResource)
  const helpItem = useStore((state) => state.helpItem)

  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'package', name: 'Package' },
    { section: 'package/resources', name: 'Resources' },
    { section: 'package/licenses', name: 'Licenses' },
    { section: 'package/contributors', name: 'Contributors' },
    { section: 'package/sources', name: 'Sources' },
  ]

  if (!shallow) {
    MENU_ITEMS.push(
      ...[
        { section: 'resource', name: 'Resource' },
        { section: 'resource/integrity', name: 'Integrity' },
        { section: 'resource/licenses', name: 'Licenses' },
        { section: 'resource/contributors', name: 'Contributors' },
        { section: 'resource/sources', name: 'Sources' },
        { section: 'dialect', name: 'Dialect', disabled: resource.type !== 'table' },
        { section: 'dialect/format', name: capitalize(format) || 'Format' },
        { section: 'schema', name: 'Schema', disabled: resource.type !== 'table' },
        { section: 'schema/fields', name: 'Fields' },
        { section: 'schema/foreignKeys', name: 'Foreign Keys' },
      ]
    )
  }

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
    <Grid container columns={12} sx={{ height: '100%' }}>
      <Grid item xs={2} sx={{ borderRight: 'solid 1px #ddd' }}>
        {!shallow && (
          <Box
            sx={{
              borderBottom: 'dashed 1px #ddd',
              paddingBottom: 1.5,
              marginBottom: 1.5,
            }}
          >
            <ResourceSelector />
          </Box>
        )}
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
      </Grid>
      <Grid item xs={6} sx={{ margin: '0px 15px' }}>
        <Sections />
        {!shallow && (
          <Box>
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
        )}
      </Grid>
      <Grid item xs={3}>
        <EditorHelp helpItem={helpItem} />
      </Grid>
    </Grid>
  )
}

function Sections() {
  const section = useStore((state) => state.section)
  if (!section) return null
  if (section == 'package') return <PackageSection />
  if (section == 'package/resources') return <ResourcesSection />
  if (section == 'package/licenses') return <LicensesSection />
  if (section == 'package/contributors') return <ContributorsSection />
  if (section == 'package/sources') return <SourcesSection />
  return null
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
