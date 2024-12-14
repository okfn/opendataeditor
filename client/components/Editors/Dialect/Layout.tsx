import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import EditorHelp from '../Base/Help'
import DialectSection from './Sections/Dialect'
import FormatSection from './Sections/Format'
import { useStore } from './store'
import * as types from '../../../types'
import { useTranslation } from 'react-i18next'
import SimpleTabs from '../../Parts/Tabs/SimpleTabs'

export default function Layout() {
  const format = useStore((state) => state.format)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const helpItem = useStore((state) => state.helpItem)
  const { t } = useTranslation()
  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'dialect', name: t('dialect') },
    { section: 'dialect/format', name: capitalize(format) || t('format') },
  ]
  const MENU_LABELS = [t('dialect'), t('format')]
  return (
    <Box sx={{ height: '100%', padding: 2 }}>
      <SimpleTabs
        labels={MENU_LABELS}
        orientation="vertical"
        onChange={(newValue: number) => {
          updateHelp(MENU_ITEMS[newValue].section)
          updateState({ section: MENU_ITEMS[newValue].section })
        }}
      >
        <div>
          <EditorHelp helpItem={helpItem} withIcon /> <DialectSection />{' '}
        </div>
        <div>
          <EditorHelp helpItem={helpItem} withIcon /> <FormatSection />
        </div>
      </SimpleTabs>
    </Box>
  )
}
