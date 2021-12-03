import * as React from 'react'
import Heading from '../Library/Heading'
import InputField from '../Library/Fields/InputField'
import MultilineField from '../Library/Fields/MultilineField'
import { useStore } from './store'

export default function General() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)

  // Components

  const General = () => (
    <React.Fragment>
      <Heading variant="h6">General</Heading>
      <Path />
      <Name />
      <Title />
      <Description />
    </React.Fragment>
  )

  const Path = () => (
    <React.Fragment>
      <InputField disabled label="Path" value={descriptor.path} />
    </React.Fragment>
  )

  const Name = () => (
    <InputField
      label="Name"
      value={descriptor.name}
      handleChange={(name) => update({ name })}
    />
  )

  const Title = () => (
    <InputField
      label="Title"
      value={descriptor.title || ''}
      handleChange={(title) => update({ title })}
    />
  )

  const Description = () => (
    <MultilineField
      label="Description"
      value={descriptor.description || ''}
      handleChange={(description) => update({ description })}
    />
  )

  return <General />
}
