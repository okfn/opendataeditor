import * as React from 'react'
import HelpCard from '../../../Parts/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Resource"
      subtitle="overview"
      link="https://framework.frictionlessdata.io/docs/guides/describing-data#describing-a-resource"
    >
      The Data Resource format describes a data resource such as an individual file or
      data table. The essence of a Data Resource is a path to the data file it describes.
    </HelpCard>
  )
}
