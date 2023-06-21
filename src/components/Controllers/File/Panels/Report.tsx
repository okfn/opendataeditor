import * as React from 'react'
import ReportPanel from '../../../Parts/Panels/Report'
import { useStore } from '../store'

export default function Report() {
  const report = useStore((state) => state.report)
  return <ReportPanel report={report} />
}
