import * as React from 'react'
import Report from '../../../Parts/Panels/Report'
import { useStore } from '../store'

export default function ReportPanel() {
  const report = useStore((state) => state.report)
  return <Report report={report} />
}
