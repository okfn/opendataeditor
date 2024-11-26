import * as types from '@client/types'
import remove from 'lodash/remove'

export function createChangeIndex(patch?: types.IHistory) {
  const changeIndex: types.IChangeIndex = { header: {}, label: {}, row: {}, cell: {} }
  if (!patch) return changeIndex
  for (const change of patch.changes) {
    if (change.type === 'row-delete') {
      const rowKey = `${change.rowNumber}`
      changeIndex.row[rowKey] = change
    } else if (change.type === 'cell-update') {
      const cellKey = `${change.rowNumber},${change.fieldName}`
      changeIndex.cell[cellKey] = change
    } else if (change.type == 'multiple-cells-update') {
      for (const cell of change.cells) {
        const cellKey = `${cell.rowNumber},${cell.fieldName}`
        changeIndex.cell[cellKey] = change
      }
    }
  }
  return changeIndex
}

export function applyTableHistory(history: types.IHistory, rows: types.IRow[]) {
  for (const change of history.changes) {
    if (change.type === 'row-delete') {
      remove(rows, (row) => row._rowNumber === change.rowNumber)
    } else if (change.type === 'cell-update') {
      for (const row of rows) {
        if (row._rowNumber === change.rowNumber) row[change.fieldName] = change.value
      }
    } else if (change.type == 'multiple-cells-update') {
      for (const row of rows) {
        for (const cell of change.cells) {
          if (row._rowNumber === cell.rowNumber) row[cell.fieldName] = cell.value
        }
      }
    }
  }
}
