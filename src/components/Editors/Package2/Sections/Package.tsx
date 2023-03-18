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
        </Box>
        <Box>
          <Homepage />
          <Version />
          <Created />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Name() {
  const name = useStore((state) => state.descriptor.name)
  const updateHelp = useStore((state) => state.updateHelp)
  const updatePackage = useStore((state) => state.updatePackage)
  return (
    <InputField
      label="Name"
      value={name}
      onFocus={() => updateHelp('package/name')}
      onChange={(name) => updatePackage({ name })}
    />
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updatePackage = useStore((state) => state.updatePackage)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('package/title')}
      onChange={(value) => updatePackage({ title: value || undefined })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.description)
  const updateHelp = useStore((state) => state.updateHelp)
  const updatePackage = useStore((state) => state.updatePackage)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onFocus={() => updateHelp('package/description')}
      onChange={(value) => updatePackage({ description: value || undefined })}
    />
  )
}

function Homepage() {
  const homepage = useStore((state) => state.descriptor.homepage)
  const updatePackage = useStore((state) => state.updatePackage)
  return (
    <InputField
      label="Homepage"
      value={homepage}
      onChange={(homepage) => updatePackage({ homepage })}
    />
  )
}

function Version() {
  const version = useStore((state) => state.descriptor.version)
  const updatePackage = useStore((state) => state.updatePackage)
  return (
    <InputField
      label="Version"
      value={version}
      onChange={(version) => updatePackage({ version })}
    />
  )
}
function Created() {
  const updatePackage = useStore((state) => state.updatePackage)
  return (
    <DatePickerField
      label="Created"
      onChange={(value) => {
        updatePackage({ created: value?.format('MM/DD/YYY') })
      }}
    />
  )
}
