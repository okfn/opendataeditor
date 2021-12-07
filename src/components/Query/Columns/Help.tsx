import * as React from 'react'
import HelpCard from '../../Library/HelpCard'

export default function Help() {
  return (
    <HelpCard
      title="Query"
      subtitle="overview"
      link="https://framework.frictionlessdata.io/docs/guides/framework/layout-guide"
    >
      The Query (previously knows as Layout) concept give us an ability to pick/skip
      arbitrary fields and rows from the data stream. It&apos;s similar to the query
      concept in databases.
    </HelpCard>
  )
}
