import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import { useStore } from '../store'

export default function General() {
  return (
    <React.Fragment>
      <HeadingBox>General</HeadingBox>
      <PickErrors />
      <SkipErrors />
    </React.Fragment>
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
