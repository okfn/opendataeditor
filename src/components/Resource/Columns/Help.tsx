import * as React from 'react'
import HelpCard from '../../Library/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Resource"
      subtitle="overview"
      link="https://framework.frictionlessdata.io/docs/guides/describing-data#describing-a-resource"
    >
      The Data Resource format describes a data resource such as an individual file or
      data table. The essence of a Data Resource is a path to the data file. Other
      properties can be declared to provide a richer set of metadata including Table
      Schema and File Dialect.
    </HelpCard>
  )
}
