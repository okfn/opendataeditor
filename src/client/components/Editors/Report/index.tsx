import './assets/styles.css'
import * as React from 'react'
import Box from '@mui/material/Box'
import ReportTask from './Task'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import * as types from '../../../types'

export interface ReportProps {
  report: types.IReport
  shallow?: boolean
}

export default function Report(props: ReportProps) {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <div className="frictionless-components-report">
        {props.shallow ? <ShallowLayout {...props} /> : <FullLayout {...props} />}
      </div>
    </ThemeProvider>
  )
}

function ShallowLayout(props: ReportProps) {
  const task = props.report.tasks[0]
  if (!task) return null
  return <ReportTask task={task} shallow />
}

function FullLayout(props: ReportProps) {
  const tasks = getSortedTasks(props.report)
  return (
    <Box>
      {!!props.report.errors.length && (
        <div className="file error">
          <h4 className="file-heading">
            <div className="inner">
              <a className="file-name">
                <strong>Errors</strong>
              </a>
            </div>
          </h4>
          <ul className="passed-tests result">
            {props.report.errors.map((error, index) => (
              <li key={index}>
                <span className="badge badge-error">{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tasks.map((task, index) => (
        <ReportTask
          key={index}
          task={task}
          taskNumber={index + 1}
          tasksCount={tasks.length}
        />
      ))}
    </Box>
  )
}

// Helpers

function getSortedTasks(report: types.IReport) {
  return [
    ...report.tasks.filter((task) => !task.valid),
    ...report.tasks.filter((task) => task.valid),
  ]
}
