import remove from 'lodash/remove'
import * as types from '../types'

export function applyTablePatch(patch: types.ITablePatch, rows: types.IRow[]) {
  for (const change of patch.changes) {
    if (change.type === 'delete-row') {
      remove(rows, (row) => row._rowNumber === change.rowNumber)
    } else if (change.type === 'update-cell') {
      for (const row of rows) {
        if (row._rowNumber === change.rowNumber) row[change.fieldName] = change.value
      }
    }
  }
}
