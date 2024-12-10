import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import InputField from '../../../../Parts/Fields/Input'
import EditorSection from '../../../Base/Section'
import * as settings from '../../../../../settings'
import { useStore, selectors, select } from '../../store'
import YesNoField from '../../../../Parts/Fields/YesNo'
import { useTranslation } from 'react-i18next'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Json" onHeadingClick={() => updateHelp('dialect/format')}>
      <Columns spacing={3}>
        <Box>
          <Keys />
          <Property />
        </Box>
        <Box>
          <Keyed />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Keys() {
  const keys = useStore(select(selectors.json, (json) => json.keys || ''))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateJson = useStore((state) => state.updateJson)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('keys')}
      value={keys}
      onFocus={() => updateHelp('dialect/format/keys')}
      onChange={(value) => updateJson({ keys: value ? value.split(',') : undefined })}
    />
  )
}

function Keyed() {
  const keyed = useStore(select(selectors.json, (json) => json.keyed))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateJson = useStore((state) => state.updateJson)
  const { t } = useTranslation()
  return (
    <YesNoField
      label={t('keyed')}
      value={keyed || settings.DEFAULT_KEYED}
      onFocus={() => updateHelp('dialect/format/keyed')}
      onChange={(keyed) => updateJson({ keyed })}
    />
  )
}

function Property() {
  const property = useStore(select(selectors.json, (json) => json.property || ''))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateJson = useStore((state) => state.updateJson)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('property')}
      value={property}
      onFocus={() => updateHelp('dialect/format/property')}
      onChange={(value) => updateJson({ property: value || undefined })}
    />
  )
}
