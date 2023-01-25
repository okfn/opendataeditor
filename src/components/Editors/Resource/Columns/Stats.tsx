import * as React from 'react'
import HeadingBox from '../../../Library/Groups/HeadingBox'
import InputField from '../../../Library/Fields/InputField'
import { useStore } from '../store'

export default function Stats() {
  return (
    <React.Fragment>
      <HeadingBox>Stats</HeadingBox>
      <Hash />
      <Bytes />
      <Fields />
      <Rows />
    </React.Fragment>
  )
}

function Hash() {
  const sha256 = useStore((state) => state.descriptor.stats?.sha256)
  return <InputField disabled label="Hash" value={sha256} />
}

function Bytes() {
  const bytes = useStore((state) => state.descriptor.stats?.bytes)
  return <InputField disabled label="Bytes" value={bytes} />
}

function Fields() {
  const fields = useStore((state) => state.descriptor.stats?.fields)
  return <InputField disabled label="Fields" value={fields} />
}

function Rows() {
  const rows = useStore((state) => state.descriptor.stats?.rows)
  return <InputField disabled label="Rows" value={rows} />
}
