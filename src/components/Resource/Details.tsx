import * as React from 'react'
import Heading from '../Library/Heading'
import InputField from '../Library/Fields/InputField'
import SelectField from '../Library/Fields/SelectField'
import * as settings from '../../settings'
import { useStore } from './store'

export default function General() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)

  // Components

  const Details = () => (
    <React.Fragment>
      <Heading variant="h6">Details</Heading>
      <Scheme />
      <Format />
      <Hashing />
      <Encoding />
    </React.Fragment>
  )

  const Scheme = () => (
    <React.Fragment>
      <InputField disabled label="Scheme" value={descriptor.scheme} />
    </React.Fragment>
  )

  const Format = () => (
    <SelectField
      label="Format"
      value={descriptor.format}
      options={settings.FORMATS}
      handleChange={(format) => update({ format })}
    />
  )

  const Hashing = () => (
    <SelectField
      label="Hashing"
      value={descriptor.hashing}
      options={settings.HASHINGS}
      handleChange={(hashing) => update({ hashing })}
    />
  )

  const Encoding = () => (
    <SelectField
      label="Encoding"
      value={descriptor.encoding}
      options={settings.ENCODINGS}
      handleChange={(encoding) => update({ encoding })}
    />
  )

  return <Details />
}
