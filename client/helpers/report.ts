import * as types from '../types'

export function createErrorIndex(report?: types.IReport) {
  const errorIndex: types.IErrorIndex = { header: {}, label: {}, row: {}, cell: {} }
  if (!report) return errorIndex
  const errorTask = report.tasks[0]
  if (!errorTask) return errorIndex
  for (const error of errorTask.errors) {
    if (!error.rowNumber && !error.fieldNumber) {
      const headerKey = '1'
      errorIndex.header[headerKey] = errorIndex.header[headerKey] || []
      errorIndex.header[headerKey].push(error)
    } else if (!error.rowNumber) {
      const labelKey = `${error.fieldName}`
      errorIndex.label[labelKey] = errorIndex.label[labelKey] || []
      errorIndex.label[labelKey].push(error)
    } else if (!error.fieldNumber) {
      const rowKey = `${error.rowNumber}`
      errorIndex.row[rowKey] = errorIndex.row[rowKey] || []
      errorIndex.row[rowKey].push(error)
    } else {
      const fieldName = error.fieldName || `_fieldNumber${error.fieldNumber}`
      const cellKey = `${error.rowNumber},${fieldName}`
      errorIndex.cell[cellKey] = errorIndex.cell[cellKey] || []
      errorIndex.cell[cellKey].push(error)
    }
  }
  return errorIndex
}

export function getErrorRowNumbers(report?: types.IReport) {
  const rowNumbers = []

  const task = report?.tasks?.[0]
  if (task) {
    for (const error of task.errors) {
      if (error.rowNumber) {
        rowNumbers.push(error.rowNumber)
      }
    }
  }

  return rowNumbers
}
