import * as React from 'react'
import Box from '@mui/material/Box'
import Report from '../../Editors/Report'
import Code from '../../Parts/Code'
import { useStore } from './store'

export default function Content() {
  const isSource = useStore((state) => state.isSource)
  const Content = isSource ? SourceContent : RenderedContent
  return (
    <Box sx={{ padding: 2 }}>
      <Content />
    </Box>
  )
}

function SourceContent() {
  const report = useStore((state) => state.file.record?.report)
  if (!report) return null
  return <Code source={JSON.stringify(report, null, 2)} />
}

function RenderedContent() {
  const report = useStore((state) => state.file.record?.report)
  if (!report) return null
  return <Report report={report} />
}
