import React from 'react'
import classNames from 'classnames'
import { IReportTask } from '../../../interfaces'
import ErrorGroup, { ErrorGroupProps } from './ErrorGroup'

export interface TaskProps {
  task: IReportTask
  taskNumber: number
  tasksCount: number
}

export default function Task(props: TaskProps) {
  const { task, taskNumber, tasksCount } = props
  const taskFile = removeBaseUrl(task.place || '')
  const splitTableFile = splitFilePath(taskFile)
  const errorGroups = getErrorGroups(task)
  return (
    <div className={classNames({ file: true, valid: task.valid, invalid: !task.valid })}>
      {/* Heading */}
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

      {/* Error groups */}
      {Object.values(errorGroups).map((errorGroup, type) => (
        <ErrorGroup key={type} {...errorGroup} />
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

export function getErrorGroups(task: IReportTask) {
  const errorGroups: { [code: string]: ErrorGroupProps } = {}
  for (const error of task.errors) {
    // Prepare errorGroup
    let errorGroup = errorGroups[error.type]
    if (!errorGroup) {
      errorGroup = {
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
    let data = errorGroup.data[error.rowNumber || 0]
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

    // Save errorGroup
    errorGroup.count += 1
    errorGroup.messages.push(error.message)
    errorGroup.data[error.rowNumber || 0] = data
    errorGroups[error.type] = errorGroup
  }

  return errorGroups
}
