import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import YesNoField from '../../Library/Fields/YesNoField'
import DescriptorField from '../../Library/Fields/DescriptorField'
import { useStore } from '../store'

export default function Schema() {
  return (
    <React.Fragment>
      <HeadingBox>Schema</HeadingBox>
      <SchemaSync />
      <SchemaPatch />
    </React.Fragment>
  )
}

function SchemaSync() {
  const update = useStore((state) => state.update)
  const schemaSync = useStore((state) => state.descriptor.schemaSync)
  return (
    <YesNoField
      label="Sync"
      value={schemaSync || false}
      onChange={(schemaSync) => update({ schemaSync })}
    />
  )
}

function SchemaPatch() {
  const update = useStore((state) => state.update)
  const schemaPatch = useStore((state) => state.descriptor.schemaPatch)
  return (
    <DescriptorField
      type="yaml"
      label="Patch"
      value={schemaPatch}
      onChange={(schemaPatch) => update({ schemaPatch })}
    />
  )
}
