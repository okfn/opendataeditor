import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/InputField'
import DatePickerField from '../../../Parts/Fields/DatePickerField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import { useStore } from '../store'

export default function Package() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Package" onHeadingClick={() => updateHelp('package')}>
      <Columns spacing={3}>
        <Box>
          <Name />
          <Title />
          <Description />
          <Keywords />
        </Box>
        <Box>
          <Homepage />
          <Version />
          <Created />
          <Image />
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
      onFocus={() => updateHelp('package/name')}
      onChange={(name) => updateDescriptor({ name })}
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
      onFocus={() => updateHelp('package/title')}
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
      onFocus={() => updateHelp('package/description')}
      onChange={(value) => updateDescriptor({ description: value || undefined })}
    />
  )
}

function Homepage() {
  const homepage = useStore((state) => state.descriptor.homepage)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Homepage"
      value={homepage}
      onFocus={() => updateHelp('package/homepage')}
      onChange={(value) => updateDescriptor({ homepage: value || undefined })}
    />
  )
}

function Version() {
  const version = useStore((state) => state.descriptor.version)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Version"
      value={version}
      onFocus={() => updateHelp('package/version')}
      onChange={(value) => updateDescriptor({ version: value || undefined })}
    />
  )
}
function Created() {
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <DatePickerField
      label="Created"
      onFocus={() => updateHelp('package/created')}
      onChange={(value) => {
        updateDescriptor({ created: value?.format('MM/DD/YYYY') })
      }}
    />
  )
}

function Keywords() {
  const keywords = useStore((state) => state.descriptor.keywords)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Keywords"
      value={keywords}
      onFocus={() => updateHelp('package/keywords')}
      onChange={(value) =>
        updateDescriptor({ keywords: value ? value.split(',') : undefined })
      }
    />
  )
}

function Image() {
  const image = useStore((state) => state.descriptor.image)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Image"
      value={image}
      onFocus={() => updateHelp('package/image')}
      onChange={(value) => updateDescriptor({ image: value || undefined })}
    />
  )
}
