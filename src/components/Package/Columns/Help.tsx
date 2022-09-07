import * as React from 'react'
import HelpCard from '../../Library/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Package"
      subtitle="overview"
      link="https://specs.frictionlessdata.io/data-package/"
    >
      A simple container format for describing a coherent collection of data in a single
      package. It provides the basis for convenient delivery, installation and management
      of datasets.
    </HelpCard>
  )
}
