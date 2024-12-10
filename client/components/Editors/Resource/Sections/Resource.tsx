import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/Input'
import SelectField from '../../../Parts/Fields/Select'
import MultilineField from '../../../Parts/Fields/Multiline'
import EditorSection from '../../Base/Section'
import Columns from '../../../Parts/Grids/Columns'
import { useStore, selectors } from '../store'
import * as store from '@client/store'
import validator from 'validator'
import { useTranslation } from 'react-i18next'

export default function Resource() {
  const updateHelp = useStore((state) => state.updateHelp)
  const onBackClick = useStore((state) => state.onBackClick)
  const { t } = useTranslation()

  return (
    <EditorSection
      name={t('resource')}
      onHeadingClick={() => updateHelp('resource')}
      onBackClick={onBackClick}
    >
      <Columns spacing={3}>
        <Box>
          <Name />
          <Type />
          <Title />
          <Description />
        </Box>
        <Box>
          <Path />
          <Columns spacing={1}>
            <Scheme />
            <Format />
          </Columns>
          <MediaType />
          <Encoding />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Name() {
  const originalName = useStore((state) => state.descriptor.name)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const [name, setName] = React.useState(originalName)
  const [isValid, setIsValid] = React.useState(isValidName(name))
  const { t } = useTranslation()

  function isValidName(name: string) {
    return name ? validator.matches(name, '^[0-9a-zA-Z-_.]+$', 'i') : false
  }
  function updateChanges(value: string) {
    if (isValidName(value)) {
      updateDescriptor({ name: value || undefined })
    } else {
      store.setResourceUpdatedFalse()
    }
  }
  return (
    <InputField
      error={!isValid}
      label={t('name')}
      value={name || ''}
      onFocus={() => updateHelp('resource/name')}
      onChange={(value) => {
        setName(value)
        setIsValid(isValidName(value))
        updateChanges(value)
      }}
      helperText={!isValid ? t('name-not-vald') : ''}
    />
  )
}

function Type() {
  const type = useStore((state) => state.descriptor.type)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()

  return (
    <SelectField
      label={t('type')}
      value={type || ''}
      options={['', 'file', 'text', 'json', 'table']}
      onFocus={() => updateHelp('resource/type')}
      onChange={(value) => updateDescriptor({ type: value || 'file' })}
    />
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const [isValid, setIsValid] = React.useState(isValidTitle())
  const { t } = useTranslation()
  function isValidTitle() {
    return title ? !validator.isNumeric(title) : true
  }
  return (
    <InputField
      error={!isValid}
      label={t('title')}
      value={title || ''}
      onFocus={() => updateHelp('resource/title')}
      onBlur={() => {
        setIsValid(isValidTitle())
      }}
      onChange={(value) => updateDescriptor({ title: value || undefined })}
      helperText={!isValid ? t('title-not-valid') : ''}
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
      onFocus={() => updateHelp('resource/description')}
      onChange={(value) => updateDescriptor({ description: value || undefined })}
    />
  )
}

// TODO: enable in context of metadata.frictionlessdata.io
function Path() {
  const path = useStore((state) => state.descriptor.path)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <InputField
      disabled
      label={t('path')}
      value={path}
      onFocus={() => updateHelp('resource/path')}
      onChange={(value) => updateDescriptor({ path: value || 'path' })}
    />
  )
}

function Scheme() {
  const scheme = useStore((state) => state.descriptor.scheme)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('scheme')}
      value={scheme || ''}
      onFocus={() => updateHelp('resource/scheme')}
      onChange={(value) => updateDescriptor({ scheme: value || undefined })}
    />
  )
}

function Format() {
  const format = useStore((state) => state.descriptor.format)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('format')}
      value={format || ''}
      onFocus={() => updateHelp('resource/format')}
      onChange={(value) => updateDescriptor({ format: value || undefined })}
    />
  )
}

function Encoding() {
  const encoding = useStore((state) => state.descriptor.encoding)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('encoding')}
      value={encoding || ''}
      onFocus={() => updateHelp('resource/encoding')}
      onChange={(value) => updateDescriptor({ encoding: value || undefined })}
    />
  )
}

function MediaType() {
  const mediatype = useStore(selectors.mediaType)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('media-type')}
      value={mediatype || ''}
      onFocus={() => updateHelp('resource/mediaType')}
      onChange={(value) => updateDescriptor({ mediatype: value || undefined })}
    />
  )
}
