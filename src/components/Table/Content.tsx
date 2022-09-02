import * as React from 'react'
import Report from '../Report'
import Source from '../Source'
import Editor from './Editor'
import { useStore } from './store'

export default function Content() {
  const report = useStore((state) => state.report)
  const source = useStore((state) => state.source)
  const isReportView = useStore((state) => state.isReportView)
  const isSourceView = useStore((state) => state.isSourceView)
  if (isReportView) return report ? <Report descriptor={report} /> : null
  if (isSourceView) return source ? <Source source={source} /> : null
  return <Editor />
}
