import Box from '@mui/material/Box'
import SchemaSection from './Sections/Schema'
import FieldsSection from './Sections/Fields'
import ForeignKeysSection from './Sections/ForeignKeys'
import SimpleTabs from '../../Parts/Tabs/SimpleTabs'
import { useTranslation } from 'react-i18next'

export default function Layout() {
  const { t } = useTranslation()

  const MENU_LABELS = [t('schema'), t('fields'), t('foreign-keys')]
  return (
    <Box sx={{ padding: 2, height: '100%' }}>
      <SimpleTabs labels={MENU_LABELS} orientation="vertical">
        <SchemaSection />
        <FieldsSection />
        <ForeignKeysSection />
      </SimpleTabs>
    </Box>
  )
}
