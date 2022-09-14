import * as React from 'react'
import Report from '../../Views/Report'
import { useStore } from './store'

export default function Content() {
  const report = useStore((state) => state.record.report)
  return <Report report={report} />
}
