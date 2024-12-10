import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import EditorSection from '../../../Base/Section'
import { useStore } from '../../store'
import { useTranslation } from 'react-i18next'

export default function General() {
  const format = useStore((state) => state.format)
  const { t } = useTranslation()
  return (
    <EditorSection name={format ? capitalize(format) : t('unknown')}>
      <Columns spacing={3}>
        <Box>{t('no-options-available-for-format')}</Box>
      </Columns>
    </EditorSection>
  )
}
