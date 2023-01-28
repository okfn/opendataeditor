import * as React from 'react'
import HelpCard from '../../../Parts/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Pipeline"
      subtitle="overview"
      link="https://framework.frictionlessdata.io/docs/guides/transform-guide#transforming-pipeline"
    >
      A pipeline is a declarative way to write out metadata transform steps. With a
      pipeline, you can transform a resource, package, or write custom plugins too.
    </HelpCard>
  )
}
