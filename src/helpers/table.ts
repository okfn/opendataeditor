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

export function createPatchIndex(patch?: types.ITablePatch) {
  const patchIndex: types.IChangeIndex = { header: {}, label: {}, row: {}, cell: {} }
  if (!patch) return patchIndex
  for (const change of patch.changes) {
    if (change.type === 'delete-row') {
      const rowKey = `${change.rowNumber}`
      patchIndex.row[rowKey] = change
    } else if (change.type === 'update-cell') {
      const cellKey = `${change.rowNumber},${change.fieldName}`
      patchIndex.cell[cellKey] = change
    }
  }
  return patchIndex
}
