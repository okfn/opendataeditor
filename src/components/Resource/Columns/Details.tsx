import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import SelectField from '../../Library/Fields/SelectField'
import * as settings from '../../../settings'
import { useStore } from '../store'

export default function Details() {
  return (
    <React.Fragment>
      <HeadingBox>Details</HeadingBox>
      <Scheme />
      <Format />
      <Hashing />
      <Encoding />
    </React.Fragment>
  )
}

function Scheme() {
  const scheme = useStore((state) => state.descriptor.scheme)
  return <InputField disabled label="Scheme" value={scheme} />
}

function Format() {
  const format = useStore((state) => state.descriptor.format)
  const update = useStore((state) => state.update)
  return (
    <SelectField
      label="Format"
      value={format}
      options={settings.FORMATS}
      handleChange={(format) => update({ format })}
    />
  )
}

function Hashing() {
  const hashing = useStore((state) => state.descriptor.hashing)
  const update = useStore((state) => state.update)
  return (
    <SelectField
      label="Hashing"
      value={hashing}
      options={settings.HASHINGS}
      handleChange={(hashing) => update({ hashing })}
    />
  )
}

function Encoding() {
  const encoding = useStore((state) => state.descriptor.encoding)
  const update = useStore((state) => state.update)
  return (
    <SelectField
      label="Encoding"
      value={encoding}
      options={settings.ENCODINGS}
      handleChange={(encoding) => update({ encoding })}
    />
  )
}
