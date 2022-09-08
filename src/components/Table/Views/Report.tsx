import * as React from 'react'
import Report from '../../Report'
import { useStore } from '../store'

export default function ReportView() {
  const report = useStore((state) => state.report)
  if (!report) return null
  return <Report descriptor={report} />
}
