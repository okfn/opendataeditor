import Box from '@mui/material/Box'
import SchemaSection from './Sections/Schema'
import FieldsSection from './Sections/Fields'
import ForeignKeysSection from './Sections/ForeignKeys'
import { useStore } from './store'
import * as types from '../../../types'
import SimpleTabs from '../../Parts/Tabs/SimpleTabs'
import { useTranslation } from 'react-i18next'

export default function Layout() {
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const { t } = useTranslation()
  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'schema', name: t('schema') },
    { section: 'schema/fields', name: t('fields') },
    { section: 'schema/foreignKeys', name: t('foreign-keys') },
  ]

  const MENU_LABELS = [t('schema'), t('fields'), t('foreign-keys')]
  return (
    <Box sx={{ padding: 2, height: '100%' }}>
      <SimpleTabs
        labels={MENU_LABELS}
        orientation="vertical"
        onChange={(newValue: number) => {
          updateHelp(MENU_ITEMS[newValue].section)
          updateState({ section: MENU_ITEMS[newValue].section })
        }}
      >
        <SchemaSection />
        <FieldsSection />
        <ForeignKeysSection />
      </SimpleTabs>
    </Box>
  )
}
