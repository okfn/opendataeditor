import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import ValuesField from '../../Library/Fields/ValuesField'
import MultiselectField from '../../Library/Fields/MultiselectField'
import * as settings from '../../../settings'
import { useStore } from '../store'

export default function General() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)

  // Components

  const General = () => (
    <React.Fragment>
      <HeadingBox>General</HeadingBox>
      <MissingValues />
      <PrimaryKey />
    </React.Fragment>
  )

  const MissingValues = () => (
    <ValuesField
      type="missing"
      values={descriptor.missingValues}
      options={settings.MISSING_VALUES}
      onChange={(missingValues) => update({ missingValues })}
    />
  )

  const PrimaryKey = () => (
    <MultiselectField
      label="Primary Key"
      value={descriptor.primaryKey || []}
      options={descriptor.fields.map((field) => field.name)}
      onChange={(primaryKey) => update({ primaryKey })}
    />
  )

  return <General />
}
