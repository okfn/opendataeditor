import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/Input'
import EditorSection from '../../Base/Section'
import Columns from '../../../Parts/Grids/Columns'
import { useStore } from '../store'
import { useTranslation } from 'react-i18next'
import EditorHelp from '../../Base/Help'

export default function Integrity() {
  const updateHelp = useStore((state) => state.updateHelp)
  const helpItem = useStore((state) => state.helpItem)
  const { t } = useTranslation()
  return (
    <EditorSection
      name={t('integrity')}
      onHeadingClick={() => updateHelp('resource/integrity')}
    >
      <EditorHelp helpItem={helpItem} withIcon />
      <Columns spacing={3}>
        <Box>
          <Hash />
          <Bytes />
        </Box>
        <Box>
          <Fields />
          <Rows />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Hash() {
  const hash = useStore((state) => state.descriptor.hash)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('hash')}
      value={hash || ''}
      onFocus={() => updateHelp('resource/integrity/hash')}
      onChange={(value) => updateDescriptor({ hash: value || undefined })}
    />
  )
}

function Bytes() {
  const bytes = useStore((state) => state.descriptor.bytes)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('bytes')}
      value={bytes || ''}
      onFocus={() => updateHelp('resource/integrity/bytes')}
      onChange={(value) => updateDescriptor({ bytes: parseInt(value) || undefined })}
    />
  )
}

function Fields() {
  const type = useStore((state) => state.descriptor.type)
  const fields = useStore((state) => state.descriptor.fields)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  // Until standards@2 we use a safer check
  if (['file', 'text', 'json'].includes(type)) return null
  return (
    <InputField
      label={t('fields')}
      value={fields || ''}
      onFocus={() => updateHelp('resource/integrity/fields')}
      onChange={(value) => updateDescriptor({ fields: parseInt(value) || undefined })}
    />
  )
}

function Rows() {
  const type = useStore((state) => state.descriptor.type)
  const rows = useStore((state) => state.descriptor.rows)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  // Until standards@2 we use a safer check
  if (['file', 'text', 'json'].includes(type)) return null
  return (
    <InputField
      label={t('rows')}
      value={rows || ''}
      onFocus={() => updateHelp('resource/integrity/rows')}
      onChange={(value) => updateDescriptor({ fields: parseInt(value) || undefined })}
    />
  )
}
