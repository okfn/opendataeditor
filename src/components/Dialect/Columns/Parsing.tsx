import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import { useStore } from '../store'

export default function Parsing() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)

  // Components

  const Parsing = () => (
    <React.Fragment>
      <HeadingBox>Parsing</HeadingBox>
      <Delimiter />
    </React.Fragment>
  )

  const Delimiter = () => (
    <React.Fragment>
      <InputField
        label="Delimiter"
        value={descriptor.delimiter}
        onChange={(delimiter) => update({ delimiter })}
      />
    </React.Fragment>
  )

  return <Parsing />
}
