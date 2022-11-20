import * as React from 'react'
import Grid from '@mui/material/Grid'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import DatePicker from '../../Library/Fields/DatePicker'
import MultilineField from '../../Library/Fields/MultilineField'
import { useStore } from '../store'

export default function General() {
  return (
    <>
      <HeadingBox>General</HeadingBox>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Name />
        </Grid>
        <Grid item xs={6}>
          <Title />
        </Grid>
        <Grid item xs={6}>
          <Homepage />
        </Grid>
        <Grid item xs={6}>
          <Version />
        </Grid>
        <Grid item xs={6}>
          <Created />
        </Grid>
      </Grid>
      <Description />
    </>
  )
}

function Name() {
  const name = useStore((state) => state.descriptor.name)
  const update = useStore((state) => state.update)
  return <InputField label="Name" value={name} onChange={(name) => update({ name })} />
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onChange={(title) => update({ title })}
    />
  )
}

function Homepage() {
  const homepage = useStore((state) => state.descriptor.homepage)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Homepage"
      value={homepage}
      onChange={(homepage) => update({ homepage })}
    />
  )
}

function Version() {
  const version = useStore((state) => state.descriptor.version)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Version"
      value={version}
      onChange={(version) => update({ version })}
    />
  )
}
function Created() {
  const update = useStore((state) => state.update)
  return (
    <DatePicker
      label="Created"
      onChange={(newValue) => {
        update({ created: newValue?.format('MM/DD/YYY') })
      }}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.description)
  const update = useStore((state) => state.update)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      rows={5}
      onChange={(description) => update({ description })}
    />
  )
}
