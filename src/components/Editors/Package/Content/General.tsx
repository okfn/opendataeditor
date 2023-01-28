import * as React from 'react'
import Grid from '@mui/material/Grid'
import HeadingBox from '../../../Parts/Groups/HeadingBox'
import InputField from '../../../Parts/Fields/InputField'
import DatePicker from '../../../Parts/Fields/DatePicker'
import MultilineField from '../../../Parts/Fields/MultilineField'
import { useStore } from '../store'

export default function General() {
  const setElementName = useStore((state) => state.setElementName)

  // Event Handlers
  function handleFocus(event: any) {
    setElementName(event.target.name.toLowerCase())
  }
  return (
    <>
      <HeadingBox>General</HeadingBox>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Name onFocus={handleFocus} />
        </Grid>
        <Grid item xs={6}>
          <Title onFocus={handleFocus} />
        </Grid>
        <Grid item xs={6}>
          <Homepage onFocus={handleFocus} />
        </Grid>
        <Grid item xs={6}>
          <Version onFocus={handleFocus} />
        </Grid>
        <Grid item xs={6}>
          <Created onFocus={handleFocus} />
        </Grid>
      </Grid>
      <Description onFocus={handleFocus} />
    </>
  )
}

function Name(props: any) {
  const name = useStore((state) => state.descriptor.name)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Name"
      value={name}
      onChange={(name) => update({ name })}
      {...props}
    />
  )
}

function Title(props: any) {
  const title = useStore((state) => state.descriptor.title)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onChange={(title) => update({ title })}
      {...props}
    />
  )
}

function Homepage(props: any) {
  const homepage = useStore((state) => state.descriptor.homepage)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Homepage"
      value={homepage}
      onChange={(homepage) => update({ homepage })}
      {...props}
    />
  )
}

function Version(props: any) {
  const version = useStore((state) => state.descriptor.version)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Version"
      value={version}
      onChange={(version) => update({ version })}
      {...props}
    />
  )
}
function Created(props: any) {
  const update = useStore((state) => state.update)
  return (
    <DatePicker
      label="Created"
      onChange={(newValue) => {
        update({ created: newValue?.format('MM/DD/YYY') })
      }}
      {...props}
    />
  )
}

function Description(props: any) {
  const description = useStore((state) => state.descriptor.description)
  const update = useStore((state) => state.update)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      rows={5}
      onChange={(description) => update({ description })}
      {...props}
    />
  )
}
