import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import HelpCard from '../../Library/HelpCard'

// TODO: remove height calc?

export default function Help() {
  const theme = useTheme()
  return (
    <HelpCard
      title="Resource"
      subtitle="overview"
      height={`calc(100% - ${theme.spacing(1)})`}
      link="https://framework.frictionlessdata.io/docs/guides/describing-data#describing-a-resource"
    >
      The File Dialect desctiptor provides information about various data aspecs. It
      tweaks the way software loads, parses, and reads the data. For example, you can
      provide a header row position or a CSV delimiter.
    </HelpCard>
  )
}
