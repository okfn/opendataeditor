import './assets/styles.css'
import Box from '@mui/material/Box'
import ReportTask from './Task'
import * as types from '../../../types'

export interface ReportProps {
  report: types.IReport
  shallow?: boolean
}

export default function Report(props: ReportProps) {
  return (
      <div className="frictionless-components-report">
        <TopLevelErrors {...props} />
        {props.shallow ? <ShallowTasks {...props} /> : <ExpandedTasks {...props} />}
      </div>
  )
}

function TopLevelErrors(props: ReportProps) {
  if (!props.report.errors.length) return null
  return (
    <div className="file error">
      {!props.shallow && (
        <h4 className="file-heading">
          <div className="inner">
            <a className="file-name">
              <strong>Errors</strong>
            </a>
          </div>
        </h4>
      )}
      <Box sx={{ overflowX: 'hidden' }}>
        <ul className="passed-tests result">
          {props.report.errors.map((error, index) => (
            <li key={index} style={{ display: 'block' }}>
              <span className="badge badge-error">{error.message}</span>
            </li>
          ))}
        </ul>
      </Box>
    </div>
  )
}

function ShallowTasks(props: ReportProps) {
  const task = props.report.tasks[0]
  if (!task) return null
  return <ReportTask task={task} shallow />
}

function ExpandedTasks(props: ReportProps) {
  const tasks = getSortedTasks(props.report)
  return (
    <Box>
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
