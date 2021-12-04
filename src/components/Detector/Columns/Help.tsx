import * as React from 'react'
import HelpCard from '../../Library/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Detector"
      subtitle="overview"
      link="https://framework.frictionlessdata.io/docs/guides/framework/detector-guide"
    >
      The Detector is used to configure how the describe command run. You can tweak
      different aspects like buffer and sample size, as well, as set field types or sync a
      schema with the provided data file
    </HelpCard>
  )
}
