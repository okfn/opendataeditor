import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import MultilineField from '../../Library/Fields/MultilineField'
import { useStore } from '../store'

export default function General() {
  return (
    <React.Fragment>
      <HeadingBox>General</HeadingBox>
      <Title />
      <Description />
      <PickErrors />
      <SkipErrors />
    </React.Fragment>
  )
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

function PickErrors() {
  const pickErrors = useStore((state) => state.descriptor.pickErrors)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Pick Errors"
      value={(pickErrors || []).join(',')}
      onChange={(value) => update({ pickErrors: value.split(',') })}
    />
  )
}

function SkipErrors() {
  const skipErrors = useStore((state) => state.descriptor.skipErrors)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Skip Errors"
      value={(skipErrors || []).join(',')}
      onChange={(value) => update({ skipErrors: value.split(',') })}
    />
  )
}
