import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import EditorHelp from '../Base/Help'
import MenuTree from '../../Parts/Trees/Menu'
import Dialect from '../Dialect'
import Schema from '../Schema'
import ResourceSection from './Sections/Resource'
import IntegritySection from './Sections/Integrity'
import LicensesSection from './Sections/Licenses'
import SourcesSection from './Sections/Sources'
import ContributorsSection from './Sections/Contributors'
import { useStore } from './store'
import * as types from '../../../types'
import { useTranslation } from 'react-i18next'

export default function Layout() {
  const externalMenu = useStore((state) => state.externalMenu)
  return (
    <Box sx={{ height: '100%' }}>
      {!externalMenu ? <LayoutWithMenu /> : <LayoutWithoutMenu />}
    </Box>
  )
}

// TODO: improve menu implementation (move some state to store / reduce re-renders)
function LayoutWithMenu() {
  const section = useStore((state) => state.section)
  const type = useStore((state) => state.descriptor.type)
  const format = useStore((state) => state.descriptor.format)
  const dialect = useStore((state) => state.descriptor.dialect)
  const schema = useStore((state) => state.descriptor.schema)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const onFieldSelected = useStore((state) => state.onFieldSelected)
  const { t } = useTranslation()

  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'resource', name: t('resource') },
    { section: 'resource/integrity', name: t('integrity') },
    { section: 'resource/licenses', name: t('licenses') },
    { section: 'resource/contributors', name: t('contributors') },
    { section: 'resource/sources', name: t('sources') },
    { section: 'dialect', name: t('dialect'), disabled: type !== 'table' },
    { section: 'dialect/format', name: capitalize(format) || t('format') },
    { section: 'schema', name: t('schema'), disabled: type !== 'table' },
    { section: 'schema/fields', name: t('fields') },
    { section: 'schema/foreignKeys', name: t('foreign-keys') },
  ]

  // We use memo to avoid nested editors re-rerender
  const handleDialectChange = React.useMemo(() => {
    return (dialect: types.IDialect) => updateDescriptor({ dialect })
  }, [])
  const handleSchemaChange = React.useMemo(() => {
    return (schema: types.ISchema) => updateDescriptor({ schema })
  }, [])

  // We use memo to avoid nested editors re-rerender
  const externalMenu = React.useMemo(() => {
    return { section }
  }, [])

  return (
    <Columns spacing={3} layout={[2, 8]} columns={10}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <MenuTree
          menuItems={MENU_ITEMS}
          selected={section}
          defaultExpanded={['resource']}
          onSelect={(section) => {
            updateHelp(section)
            updateState({ section })
            externalMenu.section = section
          }}
        />
      </Box>
      <Box>
        <Box hidden={!section.startsWith('resource')}>
          <LayoutWithoutMenu />
        </Box>
        {type === 'table' && (
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
                onFieldSelected={onFieldSelected}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Columns>
  )
}

function LayoutWithoutMenu() {
  const section = useStore((state) => state.externalMenu?.section || state.section)
  const updateHelp = useStore((state) => state.updateHelp)
  const helpItem = useStore((state) => state.helpItem)
  React.useEffect(() => updateHelp(section), [section])
  if (!section) return null
  return (
    <Columns spacing={3} layout={[5, 3]} columns={8}>
      <Box sx={{ flexGrow: 1 }}>
        <Box hidden={section !== 'resource'}>
          <ResourceSection />
        </Box>
        <Box hidden={section !== 'resource/integrity'}>
          <IntegritySection />
        </Box>
        <Box hidden={section !== 'resource/licenses'}>
          <LicensesSection />
        </Box>
        <Box hidden={section !== 'resource/contributors'}>
          <ContributorsSection />
        </Box>
        <Box hidden={section !== 'resource/sources'}>
          <SourcesSection />
        </Box>
      </Box>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}
