import remove from 'lodash/remove'
import * as types from '@client/types'

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
