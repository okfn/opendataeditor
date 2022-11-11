import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import BasicDatePicker from '../../Library/Fields/DatePicker'

import MultilineField from '../../Library/Fields/MultilineField'
import { useStore } from '../store'

export default function General() {
  return (
    <React.Fragment>
      <HeadingBox>General</HeadingBox>
      <Name />
      <Title />
      <Homepage />
      <Version />
      <Created />
      <Description />
    </React.Fragment>
  )
}

function Created() {
  const created = useStore((state) => state.descriptor.created)
  const update = useStore((state) => state.update)
  return <BasicDatePicker label="Created" onChange={() => update({ created })} />
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

function Description() {
  const description = useStore((state) => state.descriptor.description)
  const update = useStore((state) => state.update)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onChange={(description) => update({ description })}
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
