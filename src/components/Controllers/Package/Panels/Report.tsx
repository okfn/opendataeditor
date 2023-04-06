import * as React from 'react'
import Box from '@mui/material/Box'
import Report from '../../../Editors/Report'
import { IReport } from '../../../../interfaces'
import { useStore } from '../store'

export default function ReportPanel() {
  const file = useStore((state) => state.file)
  const report = useStore((state) => state.file.record?.report)
  if (!report) return null
  // TODO: for now there is not real metadata validation so we just hack Report to show valid
  const stubReport: IReport = {
    ...report,
    tasks: [
      {
        valid: true,
        name: 'name',
        type: 'json',
        place: file.path,
        labels: [],
        stats: { errors: 0, warnings: 0, seconds: 0 },
        errors: [],
      },
    ],
  }
  return (
    <Box sx={{ paddingX: 2 }}>
      <Report report={stubReport} />
    </Box>
  )
}
