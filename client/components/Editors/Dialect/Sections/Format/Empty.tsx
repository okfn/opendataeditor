import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import EditorSection from '../../../Base/Section'
import { useStore } from '../../store'
import { t } from 'i18next'

export default function General() {
  const format = useStore((state) => state.format)
  return (
    <EditorSection name={format ? capitalize(format) : t('unknown')}>
      <Columns spacing={3}>
        <Box>{t('no-options-available-for-format')}</Box>
      </Columns>
    </EditorSection>
  )
}
