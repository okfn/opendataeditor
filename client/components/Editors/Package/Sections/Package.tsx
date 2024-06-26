import * as React from 'react'
import Grid from '@mui/material/Grid'
import InputField from '../../../Parts/Fields/Input'
import DateTimePickerField from '../../../Parts/Fields/DateTimePicker'
import MultilineField from '../../../Parts/Fields/Multiline'
import EditorSection from '../../Base/Section'
import { useStore } from '../store'
import validator from 'validator'
import dayjs from 'dayjs'

export default function Package() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Package" onHeadingClick={() => updateHelp('package')}>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={6}>
          <Name />
          <Title />
          <Description />
          <Keywords />
        </Grid>
        <Grid item xs={6}>
          <Homepage />
          <Version />
          <Created />
          <Image />
        </Grid>
      </Grid>
    </EditorSection>
  )
}

function Name() {
  const name = useStore((state) => state.descriptor.name)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const [isValid, setIsValid] = React.useState(isValidName())
  function isValidName() {
    return name ? validator.isSlug(name) : true
  }
  return (
    <InputField
      error={!isValid}
      label="Name"
      value={name || ''}
      onFocus={() => updateHelp('package/name')}
      onBlur={() => {
        setIsValid(isValidName())
      }}
      onChange={(value) => updateDescriptor({ name: value || undefined })}
      helperText={!isValid ? 'Name is not valid.' : ''}
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
      label="Title"
      error={!isValid}
      value={title || ''}
      onFocus={() => updateHelp('package/title')}
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
  const created = useStore((state) => state.descriptor.created)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <DateTimePickerField
      label="Created"
      value={created ? dayjs(created) : null}
      onFocus={() => updateHelp('package/created')}
      onChange={(value) => {
        updateDescriptor({ created: value?.format('YYYY-MM-DDTHH:mm:ss') })
      }}
      errorMessage={'Date is not valid'}
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
