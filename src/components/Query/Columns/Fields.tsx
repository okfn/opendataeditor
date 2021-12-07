import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import { useStore } from '../store'

export default function Fields() {
  return (
    <React.Fragment>
      <HeadingBox>Fields</HeadingBox>
      <PickFields />
      <SkipFields />
      <LimitFields />
      <OffsetFields />
    </React.Fragment>
  )
}

function PickFields() {
  const pickFields = useStore((state) => state.descriptor.pickFields)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Pick Fields"
      value={(pickFields || []).join(',')}
      onChange={(value) => update({ pickFields: value.split(',') })}
    />
  )
}

function SkipFields() {
  const skipFields = useStore((state) => state.descriptor.skipFields)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Skip Fields"
      value={(skipFields || []).join(',')}
      onChange={(value) => update({ skipFields: value.split(',') })}
    />
  )
}

function LimitFields() {
  const limitFields = useStore((state) => state.descriptor.limitFields)
  const update = useStore((state) => state.update)
  return (
    <InputField
      type="number"
      label="Limit Fields"
      value={limitFields || ''}
      onChange={(value) => update({ limitFields: parseInt(value) })}
    />
  )
}

function OffsetFields() {
  const offsetFields = useStore((state) => state.descriptor.offsetFields)
  const update = useStore((state) => state.update)
  return (
    <InputField
      type="number"
      label="Offset Fields"
      value={offsetFields || ''}
      onChange={(value) => update({ offsetFields: parseInt(value) })}
    />
  )
}
