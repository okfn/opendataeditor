import * as React from 'react'
import HelpCard from '../../../Library/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Schema"
      subtitle="overview"
      link="https://framework.frictionlessdata.io/docs/guides/describing-data#describing-a-schema"
    >
      Table Schema is a specification for providing a schema for tabular data. It includes
      the expected data type for each value in a column.
    </HelpCard>
  )
}
