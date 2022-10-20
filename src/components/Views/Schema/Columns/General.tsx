import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import ValuesField from '../../Library/Fields/ValuesField'
import MultiselectField from '../../Library/Fields/MultiselectField'
import * as settings from '../../../../settings'
import { useStore } from '../store'

export default function General() {
  return (
    <React.Fragment>
      <HeadingBox>General</HeadingBox>
      <MissingValues />
      <PrimaryKey />
    </React.Fragment>
  )
}

function MissingValues() {
  const missingValues = useStore((state) => state.descriptor.missingValues)
  const update = useStore((state) => state.update)
  return (
    <ValuesField
      type="missing"
      values={missingValues || settings.DEFAULT_MISSING_VALUES}
      options={settings.MISSING_VALUES}
      onChange={(missingValues) => update({ missingValues })}
    />
  )
}

function PrimaryKey() {
  const primaryKey = useStore((state) => state.descriptor.primaryKey)
  const fields = useStore((state) => state.descriptor.fields)
  const update = useStore((state) => state.update)
  return (
    <MultiselectField
      label="Primary Key"
      value={primaryKey || []}
      options={fields.map((field) => field.name)}
      onChange={(primaryKey) =>
        update({ primaryKey: primaryKey.length ? primaryKey : undefined })
      }
    />
  )
}
