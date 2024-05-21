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
    } else if (change.type == 'multiple-cells-update') {
      for (const cell of change.cells) {
        const cellKey = `${cell.rowNumber},${cell.fieldName}`
        changeIndex.cell[cellKey] = change
      }
    }
  }
  return changeIndex
}
