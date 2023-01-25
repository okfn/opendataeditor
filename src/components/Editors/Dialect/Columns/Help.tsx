import * as React from 'react'
import HelpCard from '../../../Library/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Dialect"
      subtitle="overview"
      link="https://framework.frictionlessdata.io/docs/guides/describing-data#describing-a-resource"
    >
      The File Dialect desctiptor provides information about various data aspecs. It
      tweaks the way software loads, parses, and reads the data.
    </HelpCard>
  )
}
