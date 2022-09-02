import * as React from 'react'
import Report from '../Report'
import Source from '../Source'
import Editor from './Editor'
import { useStore } from './store'

export default function Content() {
  const report = useStore((state) => state.report)
  const source = useStore((state) => state.source)
  const contentType = useStore((state) => state.contentType)
  switch (contentType) {
    case 'report':
      return report ? <Report descriptor={report} /> : null
    case 'source':
      return source ? <Source source={source} /> : null
    default:
      return <Editor />
  }
}
