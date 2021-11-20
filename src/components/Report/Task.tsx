import React from 'react'
import classNames from 'classnames'
import { IReportTask, IReportError } from '../../interfaces'
import Error from './Error'

export interface TaskProps {
  task: IReportTask
  taskNumber: number
  tasksCount: number
}

export default function Task(props: TaskProps) {
  const { task, taskNumber, tasksCount } = props
  const taskFile = removeBaseUrl(task.resource.path || '')
  const splitTableFile = splitFilePath(taskFile)
  const reportErrors = getReportErrors(task)
  return (
    <div className={classNames({ file: true, valid: task.valid, invalid: !task.valid })}>
      {/* Heading */}
      <h4 className="file-heading">
        <div className="inner">
          <a className="file-name" href={task.resource.path}>
            {task.resource.path ? (
              <span>
                <strong>{splitTableFile.base}</strong>
                <strong>{splitTableFile.sep}</strong>
                <strong>{splitTableFile.name}</strong>
              </span>
            ) : (
              <strong>{task.resource.name}</strong>
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

      {/* Error groups */}
      {Object.values(reportErrors).map((reportError) => (
        <Error key={reportError.code} reportError={reportError} />
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

export function getReportErrors(task: IReportTask) {
  const reportErrors: { [code: string]: IReportError } = {}
  for (const error of task.errors) {
    const header = task.resource.schema.fields.map((field) => field.name)

    // Prepare reportError
    let reportError = reportErrors[error.code]
    if (!reportError) {
      reportError = {
        count: 0,
        code: error.code,
        name: error.name,
        tags: error.tags,
        description: error.description,
        header,
        messages: [],
        data: {},
      }
    }

    // Prepare cells
    let data = reportError.data[error.rowPosition || 0]
    if (!data) {
      const values = error.cells || error.labels || []
      data = { values, errors: new Set() }
    }

    // Ensure blank row
    if (error.code === 'blank-row') {
      data.values = header.map(() => '')
    }

    // Ensure missing cell
    if (error.code === 'missing-cell') {
      // TODO: use type system instead of "!"
      data.values[error.fieldPosition! - 1] = ''
    }

    // Add row errors
    if (error.fieldPosition) {
      data.errors.add(error.fieldPosition)
    } else if (data.values) {
      data.errors = new Set(data.values.map((_, index) => index + 1))
    }

    // Save reportError
    reportError.count += 1
    reportError.messages.push(error.message)
    reportError.data[error.rowPosition || 0] = data
    reportErrors[error.code] = reportError
  }

  return reportErrors
}
