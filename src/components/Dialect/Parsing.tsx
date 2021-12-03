import * as React from 'react'
import Heading from '../Library/Heading'
import InputField from '../Library/Fields/InputField'
import { useStore } from './store'

export default function Parsing() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)

  // Components

  const Parsing = () => (
    <React.Fragment>
      <Heading variant="h6">Parsing</Heading>
      <Delimiter />
    </React.Fragment>
  )

  const Delimiter = () => (
    <React.Fragment>
      <InputField
        label="Delimiter"
        value={descriptor.delimiter}
        handleChange={(delimiter) => update({ delimiter })}
      />
    </React.Fragment>
  )

  return <Parsing />
}
