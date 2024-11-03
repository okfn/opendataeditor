import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/Input'
import SelectField from '../../../Parts/Fields/Select'
import MultilineField from '../../../Parts/Fields/Multiline'
import EditorSection from '../../Base/Section'
import Columns from '../../../Parts/Grids/Columns'
import { useStore, selectors } from '../store'
import validator from 'validator'

export default function Resource() {
  const updateHelp = useStore((state) => state.updateHelp)
  const onBackClick = useStore((state) => state.onBackClick)
  return (
    <EditorSection
      name="Resource"
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

  function isValidName(name: string) {
    return name ? validator.matches(name, '^[0-9a-zA-Z-_.]+$', 'i') : false
  }
  function updateChanges(value: string) {
    if (isValidName(value)) {
      updateDescriptor({ name: value || undefined })
    }
  }
  return (
    <InputField
      error={!isValid}
      label="Name"
      value={name || ''}
      onFocus={() => updateHelp('resource/name')}
      onChange={(value) => {
        setName(value)
        setIsValid(isValidName(value))
        updateChanges(value)
      }}
      helperText={!isValid ? 'Name is not valid.' : ''}
    />
  )
}

function Type() {
  const type = useStore((state) => state.descriptor.type)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <SelectField
      label="Type"
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
  function isValidTitle() {
    return title ? !validator.isNumeric(title) : true
  }
  return (
    <InputField
      error={!isValid}
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('resource/title')}
      onBlur={() => {
        setIsValid(isValidTitle())
      }}
      onChange={(value) => updateDescriptor({ title: value || undefined })}
      helperText={!isValid ? 'Title is not valid.' : ''}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.description)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <MultilineField
      label="Description"
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
  return (
    <InputField
      disabled
      label="Path"
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
  return (
    <InputField
      label="Scheme"
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
  return (
    <InputField
      label="Format"
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
  return (
    <InputField
      label="Encoding"
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
  return (
    <InputField
      label="Media Type"
      value={mediatype || ''}
      onFocus={() => updateHelp('resource/mediaType')}
      onChange={(value) => updateDescriptor({ mediatype: value || undefined })}
    />
  )
}
