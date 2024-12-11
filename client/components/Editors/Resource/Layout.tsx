import * as React from 'react'
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
import SimpleTabs from '../../Parts/Tabs/SimpleTabs'

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
  const format = useStore((state) => state.descriptor.format)
  const dialect = useStore((state) => state.descriptor.dialect)
  const schema = useStore((state) => state.descriptor.schema)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const onFieldSelected = useStore((state) => state.onFieldSelected)
  const { t } = useTranslation()

  const TAB_LABELS = [t('resource'), t('dialect'), t('schema')]

  const RESOURCE_MENU_ITEMS: types.IMenuItem[] = [
    { section: 'resource', name: t('resource') },
    { section: 'resource/integrity', name: t('integrity') },
    { section: 'resource/licenses', name: t('licenses') },
    { section: 'resource/contributors', name: t('contributors') },
    { section: 'resource/sources', name: t('sources') },
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
    <SimpleTabs
      labels={TAB_LABELS}
      onChange={(section: string) => {
        updateHelp(section)
        updateState({ section })
        externalMenu.section = section
      }}
    >
      <Columns spacing={3} layout={[3, 5]} columns={8}>
        <Box sx={{ flexGrow: 1 }}>
          <MenuTree
            menuItems={RESOURCE_MENU_ITEMS}
            selected={section}
            defaultExpanded={['resources']}
            onSelect={(section) => {
              updateHelp(section)
              updateState({ section })
            }}
          />
          <LayoutWithoutMenu />
        </Box>
      </Columns>
      <Dialect format={format} dialect={dialect} onChange={handleDialectChange} />
      <Schema
        schema={schema}
        onChange={handleSchemaChange}
        onFieldSelected={onFieldSelected}
      />
    </SimpleTabs>
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
