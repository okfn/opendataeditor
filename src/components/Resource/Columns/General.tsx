import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import MultilineField from '../../Library/Fields/MultilineField'
import { useStore } from '../store'

export default function General() {
  return (
    <React.Fragment>
      <HeadingBox>General</HeadingBox>
      <Path />
      <Name />
      <Title />
      <Description />
    </React.Fragment>
  )
}

function Path() {
  const path = useStore((state) => state.descriptor.path)
  return <InputField disabled label="Path" value={path} />
}

function Name() {
  const name = useStore((state) => state.descriptor.name)
  const update = useStore((state) => state.update)
  return (
    <InputField label="Name" value={name} handleChange={(name) => update({ name })} />
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Title"
      value={title || ''}
      handleChange={(title) => update({ title })}
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
      handleChange={(description) => update({ description })}
    />
  )
}
