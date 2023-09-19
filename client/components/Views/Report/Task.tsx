import classNames from 'classnames'
import ReportGroup, { ReportGroupProps } from './Group'
import * as types from '../../../types'

export interface ReportTaskProps {
  task: types.IReportTask
  shallow?: boolean
  taskNumber?: number
  tasksCount?: number
}

export default function ReportTask(props: ReportTaskProps) {
  const { task, taskNumber, tasksCount } = props
  const taskFile = removeBaseUrl(task.place || '')
  const splitTableFile = splitFilePath(taskFile)
  const groups = getGroups(task)
  return (
    <div className={classNames({ file: true, valid: task.valid, invalid: !task.valid })}>
      {!props.shallow && (
        <h4 className="file-heading">
          <div className="inner">
            <a className="file-name" href={task.place}>
              {task.place ? (
                <span>
                  <strong>{splitTableFile.base}</strong>
                  <strong>{splitTableFile.sep}</strong>
                  <strong>{splitTableFile.name}</strong>
                  <strong>&nbsp;({task.valid ? 'valid' : 'invalid'})</strong>
                </span>
              ) : (
                <strong>
                  {task.name} ({task.valid ? 'valid' : 'invalid'})
                </strong>
              )}
              {!task.valid && (
                <span
                  className="badge"
                  data-toggle="tooltip"
                  data-placement="right"
                  title={`${task.stats.errors} errors found for this task`}
                >
                  {task.stats.errors}
                </span>
              )}
            </a>
            <span className="file-count">
              Task {taskNumber} of {tasksCount}
            </span>
          </div>
        </h4>
      )}
      {Object.values(groups).map((group, type) => (
        <ReportGroup key={type} {...group} />
      ))}
    </div>
  )
}

// Helpers

export function removeBaseUrl(text: string) {
  return text.replace(/https:\/\/raw\.githubusercontent\.com\/\S*?\/\S*?\/\S*?\//g, '')
}

export function splitFilePath(path: string) {
  const parts = path.split('/')
  return {
    name: parts.pop(),
    base: parts.join('/'),
    sep: parts.length ? '/' : '',
  }
}

export function getGroups(task: types.IReportTask) {
  const groups: { [code: string]: ReportGroupProps } = {}
  for (const error of task.errors) {
    // Prepare group
    let group = groups[error.type]
    if (!group) {
      group = {
        count: 0,
        type: error.type,
        title: error.title,
        description: error.description,
        tags: error.tags,
        labels: task.labels,
        messages: [],
        data: {},
      }
    }

    // Prepare cells
    let data = group.data[error.rowNumber || 0]
    if (!data) {
      const values = error.cells || error.labels || []
      data = { values, errors: new Set() }
    }

    // Ensure blank row
    if (error.type === 'blank-row') {
      data.values = task.labels.map(() => '')
    }

    // Ensure missing cell
    if (error.type === 'missing-cell') {
      // TODO: use type system instead of "!"
      data.values[error.fieldNumber! - 1] = ''
    }

    // Add row errors
    if (error.fieldNumber) {
      data.errors.add(error.fieldNumber)
    } else if (data.values) {
      data.errors = new Set(data.values.map((_, index) => index + 1))
    }

    // Save group
    group.count += 1
    group.messages.push(error.message)
    group.data[error.rowNumber || 0] = data
    groups[error.type] = group
  }

  return groups
}
