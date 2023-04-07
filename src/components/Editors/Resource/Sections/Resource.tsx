import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/InputField'
import SelectField from '../../../Parts/Fields/SelectField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import { useStore, selectors } from '../store'

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
          <MediaType />
        </Box>
        <Box>
          <Path />
          <Scheme />
          <Format />
          <Encoding />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Name() {
  const name = useStore((state) => state.descriptor.name)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Name"
      value={name}
      onFocus={() => updateHelp('resource/name')}
      onChange={(value) => updateDescriptor({ name: value || 'name' })}
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
      value={type}
      options={['file', 'text', 'json', 'table']}
      onFocus={() => updateHelp('resource/type')}
      onChange={(value) => updateDescriptor({ type: value || 'file' })}
    />
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('resource/title')}
      onChange={(value) => updateDescriptor({ title: value || undefined })}
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

function Path() {
  const path = useStore((state) => state.descriptor.path)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
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
