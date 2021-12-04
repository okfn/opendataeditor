import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import { useStore } from '../store'

export default function Parsing() {
  return (
    <React.Fragment>
      <HeadingBox>Parsing</HeadingBox>
      <Delimiter />
    </React.Fragment>
  )
}

function Delimiter() {
  const delimiter = useStore((state) => state.descriptor.delimiter)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Delimiter"
      value={delimiter}
      onChange={(delimiter) => update({ delimiter })}
    />
  )
}
