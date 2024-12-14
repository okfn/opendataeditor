import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/Input'
import MultiselectField from '../../../Parts/Fields/Multiselect'
import MultilineField from '../../../Parts/Fields/Multiline'
import EditorSection from '../../Base/Section'
import Columns from '../../../Parts/Grids/Columns'
import { useStore, selectors } from '../store'
import validator from 'validator'
import { useTranslation } from 'react-i18next'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  const { t } = useTranslation()
  return (
    <EditorSection name={t('schema')} onHeadingClick={() => updateHelp('schema')}>
      <Columns spacing={3}>
        <Box>
          <Name />
          <Title />
          <Description />
        </Box>
        <Box>
          <PrimaryKey />
          <MissingValues />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Name() {
  const name = useStore((state) => state.descriptor.name)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const [isValid, setIsValid] = React.useState(isValidName())
  const { t } = useTranslation()
  function isValidName() {
    return name ? validator.isSlug(name) : true
  }
  return (
    <InputField
      error={!isValid}
      label={t('name')}
      value={name || ''}
      onFocus={() => updateHelp('schema/name')}
      onBlur={() => {
        setIsValid(isValidName())
      }}
      onChange={(value) => updateDescriptor({ name: value || undefined })}
      helperText={!isValid ? t('name-not-valid') : ''}
    />
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('title')}
      value={title || ''}
      onFocus={() => updateHelp('schema/title')}
      onChange={(value) => updateDescriptor({ title: value || undefined })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.description)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <MultilineField
      label={t('description')}
      value={description || ''}
      onFocus={() => updateHelp('schema/description')}
      onChange={(value) => updateDescriptor({ description: value || undefined })}
    />
  )
}

function PrimaryKey() {
  const fieldNames = useStore(selectors.fieldNames)
  const primaryKey = useStore((state) => state.descriptor.primaryKey)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <MultiselectField
      label={t('primary-key')}
      value={primaryKey || []}
      options={fieldNames}
      onFocus={() => updateHelp('schema/primaryKey')}
      onChange={(value) => updateDescriptor({ primaryKey: value || undefined })}
    />
  )
}

// TODO: support empty strings
function MissingValues() {
  const missingValues = useStore((state) => state.descriptor.missingValues)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('missing-values')}
      value={(missingValues || []).join(',')}
      onFocus={() => updateHelp('schema/missingValues')}
      onChange={(value) =>
        updateDescriptor({ missingValues: value ? value.split(',') : undefined })
      }
    />
  )
}
