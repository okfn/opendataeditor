import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import { useStore } from '../store'

export default function Rows() {
  return (
    <React.Fragment>
      <HeadingBox>Rows</HeadingBox>
      <PickRows />
      <SkipRows />
      <LimitRows />
      <OffsetRows />
    </React.Fragment>
  )
}

function PickRows() {
  const pickRows = useStore((state) => state.descriptor.pickRows)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Pick Rows"
      value={(pickRows || []).join(',')}
      onChange={(value) => update({ pickRows: value.split(',') })}
    />
  )
}

function SkipRows() {
  const skipRows = useStore((state) => state.descriptor.skipRows)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Skip Rows"
      value={(skipRows || []).join(',')}
      onChange={(value) => update({ skipRows: value.split(',') })}
    />
  )
}

function LimitRows() {
  const limitRows = useStore((state) => state.descriptor.limitRows)
  const update = useStore((state) => state.update)
  return (
    <InputField
      type="number"
      label="Limit Rows"
      value={limitRows || ''}
      onChange={(value) => update({ limitRows: parseInt(value) })}
    />
  )
}

function OffsetRows() {
  const offsetRows = useStore((state) => state.descriptor.offsetRows)
  const update = useStore((state) => state.update)
  return (
    <InputField
      type="number"
      label="Offset Rows"
      value={offsetRows || ''}
      onChange={(value) => update({ offsetRows: parseInt(value) })}
    />
  )
}
