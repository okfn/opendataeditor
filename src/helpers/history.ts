import * as types from '../types'

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
    }
  }
  return changeIndex
}
