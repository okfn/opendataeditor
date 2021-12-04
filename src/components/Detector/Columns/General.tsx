import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import { useStore } from '../store'

export default function General() {
  return (
    <React.Fragment>
      <HeadingBox>General</HeadingBox>
      <BufferSize />
      <SampleSize />
    </React.Fragment>
  )
}

function BufferSize() {
  const bufferSize = useStore((state) => state.descriptor.bufferSize)
  const update = useStore((state) => state.update)
  return (
    <InputField
      type="number"
      label="Buffer Size"
      inputProps={{ min: 0, step: 10000 }}
      value={bufferSize}
      onChange={(bufferSize) => update({ bufferSize })}
    />
  )
}

function SampleSize() {
  const sampleSize = useStore((state) => state.descriptor.sampleSize)
  const update = useStore((state) => state.update)
  return (
    <InputField
      type="number"
      label="Sample Size"
      inputProps={{ min: 0, step: 100 }}
      value={sampleSize}
      onChange={(sampleSize) => update({ sampleSize })}
    />
  )
}
