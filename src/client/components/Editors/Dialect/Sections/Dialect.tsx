import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/Input'
import MultilineField from '../../../Parts/Fields/Multiline'
import SelectField from '../../../Parts/Fields/Select'
import EditorSection from '../../Base/Section'
import Columns from '../../../Parts/Grids/Columns'
import { useStore } from '../store'
import validator from 'validator'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Dialect" onHeadingClick={() => updateHelp('dialect')}>
      <Columns spacing={3}>
        <Box>
          <Title />
          <Description />
        </Box>
        <Box>
          <Type />
          <Format />
        </Box>
      </Columns>
    </EditorSection>
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
      onFocus={() => updateHelp('dialect/title')}
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
      onFocus={() => updateHelp('dialect/description')}
      onChange={(value) => updateDescriptor({ description: value || undefined })}
    />
  )
}

function Type() {
  const type = useStore((state) => state.type)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const externalMenu = useStore((state) => state.externalMenu)
  return (
    <SelectField
      label="Type"
      value={type || ''}
      disabled={!!externalMenu}
      options={['file', 'text', 'json', 'table']}
      onFocus={() => updateHelp('dialect/type')}
      onChange={(value) => updateState({ type: value || 'table' })}
    />
  )
}

function Format() {
  const format = useStore((state) => state.format)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const externalMenu = useStore((state) => state.externalMenu)
  return (
    <SelectField
      label="Format"
      value={format || ''}
      disabled={!!externalMenu}
      options={['csv', 'excel', 'json']}
      onFocus={() => updateHelp('dialect/format')}
      onChange={(value) => updateState({ format: value || 'table' })}
    />
  )
}
