import Box from '@mui/material/Box'
import SchemaSection from './Sections/Schema'
import FieldsSection from './Sections/Fields'
import ForeignKeysSection from './Sections/ForeignKeys'
import { useStore } from './store'
import * as types from '../../../types'
import SimpleTabs from '../../Parts/Tabs/SimpleTabs'
import { useTranslation } from 'react-i18next'
import EditorHelp from '../Base/Help'

export default function Layout() {
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const helpItem = useStore((state) => state.helpItem)
  const { t } = useTranslation()
  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'schema', name: t('default') },
    { section: 'schema/fields', name: t('fields') },
    { section: 'schema/foreignKeys', name: t('foreign-keys') },
  ]

  const MENU_LABELS = MENU_ITEMS.map((item) => item.name)

  return (
    <Box sx={{ height: '100%' }}>
      <SimpleTabs
        labels={MENU_LABELS}
        orientation="vertical"
        onChange={(newValue: number) => {
          updateHelp(MENU_ITEMS[newValue].section)
          updateState({ section: MENU_ITEMS[newValue].section })
        }}
      >
        <div>
          <EditorHelp helpItem={helpItem} withIcon />
          <SchemaSection />
        </div>
        <div>
          <EditorHelp helpItem={helpItem} withIcon />
          <FieldsSection />
        </div>
        <div>
          <EditorHelp helpItem={helpItem} withIcon />
          <ForeignKeysSection />
        </div>
      </SimpleTabs>
    </Box>
  )
}
