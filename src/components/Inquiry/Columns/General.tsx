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
      <LimitErrors />
      <LimitMemory />
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

function LimitErrors() {
  const limitErrors = useStore((state) => state.descriptor.limitErrors)
  const update = useStore((state) => state.update)
  return (
    <InputField
      type="number"
      label="Limit Errors"
      value={limitErrors || ''}
      onChange={(value) => update({ limitErrors: parseInt(value) })}
    />
  )
}

function LimitMemory() {
  const limitMemory = useStore((state) => state.descriptor.limitMemory)
  const update = useStore((state) => state.update)
  return (
    <InputField
      type="number"
      label="Limit Memory"
      value={limitMemory || ''}
      onChange={(value) => update({ limitMemory: parseInt(value) })}
    />
  )
}
