import * as React from 'react'
import Box from '@mui/material/Box'
import EditorHelp from '../Base/Help'
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
  const format = useStore((state) => state.descriptor.format)
  const dialect = useStore((state) => state.descriptor.dialect)
  const schema = useStore((state) => state.descriptor.schema)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const onFieldSelected = useStore((state) => state.onFieldSelected)
  const helpItem = useStore((state) => state.helpItem)
  const { t } = useTranslation()

  const TOP_TAB_LABELS = [t('resource'), t('dialect'), t('schema')]

  const RESOURCE_MENU_ITEMS: types.IMenuItem[] = [
    { section: 'resource', name: t('default') },
    { section: 'resource/integrity', name: t('integrity') },
    { section: 'resource/licenses', name: t('licenses') },
    { section: 'resource/contributors', name: t('contributors') },
    { section: 'resource/sources', name: t('sources') },
  ]

  const MENU_LABELS = RESOURCE_MENU_ITEMS.map((item) => item.name)

  // We use memo to avoid nested editors re-rerender
  const handleDialectChange = React.useMemo(() => {
    return (dialect: types.IDialect) => updateDescriptor({ dialect })
  }, [])
  const handleSchemaChange = React.useMemo(() => {
    return (schema: types.ISchema) => updateDescriptor({ schema })
  }, [])

  return (
    <Box sx={{ height: '100%', padding: 2 }}>
      <SimpleTabs labels={TOP_TAB_LABELS}>
        <SimpleTabs
          labels={MENU_LABELS}
          orientation="vertical"
          onChange={(newValue: number) => {
            updateHelp(RESOURCE_MENU_ITEMS[newValue].section)
            updateState({ section: RESOURCE_MENU_ITEMS[newValue].section })
          }}
        >
          <div>
            <EditorHelp helpItem={helpItem} withIcon />
            <ResourceSection />
          </div>
          <div>
            <EditorHelp helpItem={helpItem} withIcon />
            <IntegritySection />
          </div>
          <div>
            <EditorHelp helpItem={helpItem} withIcon />
            <LicensesSection />
          </div>
          <div>
            <EditorHelp helpItem={helpItem} withIcon />
            <ContributorsSection />
          </div>
          <div>
            <EditorHelp helpItem={helpItem} withIcon />
            <SourcesSection />
          </div>
        </SimpleTabs>
        <Dialect format={format} dialect={dialect} onChange={handleDialectChange} />
        <Schema
          schema={schema}
          onChange={handleSchemaChange}
          onFieldSelected={onFieldSelected}
        />
      </SimpleTabs>
    </Box>
  )
}
