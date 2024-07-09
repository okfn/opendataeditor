import TableEditor from '../../Editors/Table'
import * as React from 'react'
import { useKeyPress } from 'ahooks'
import * as store from '@client/store'

export default function Editor() {
  const schema = store.useStore((state) => state.record?.resource.schema)
  const report = store.useStore((state) => state.report)
  const table = store.useStore((state) => state.table)

  const [cellSelection, setCellSelection] = React.useState({})

  // works automatically, doesnt need to be passed to <TableEditor with onKeyPress
  useKeyPress(['delete', 'backspace'], () => {
    store.deleteMultipleCells(cellSelection)
  })

  if (!schema) return null
  if (!report) return null
  if (!table) return null

  return (
    <TableEditor
      editable
      source={store.tableLoader}
      schema={schema}
      report={report}
      history={table.history}
      selection={table.selection}
      onEditStart={store.startTableEditing}
      onEditComplete={store.saveTableEditing}
      onEditStop={store.stopTableEditing}
      defaultCellSelection={cellSelection}
      onCellSelectionChange={setCellSelection}
      handle={(ref) => store.setRefs({ grid: ref })}
    />
  )
}
