import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import SelectField from '../../Library/Fields/SelectField'
import { useStore } from '../store'

export default function General() {
  return (
    <React.Fragment>
      <HeadingBox>General</HeadingBox>
      <Type />
    </React.Fragment>
  )
}

function Type() {
  const type = useStore((state) => state.descriptor.type)
  const update = useStore((state) => state.update)
  return (
    <SelectField
      label="Type"
      value={type || 'resource'}
      options={['resource']}
      onChange={(type) => update({ type })}
    />
  )
}
