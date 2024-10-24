import TableEditor from '../../Editors/Table'
import { ClickAwayListener } from '@mui/base'
import Box from '@mui/material/Box'
import * as React from 'react'
import { useKeyPress } from 'ahooks'
import * as store from '@client/store'
import * as types from '@client/types'

export default function Editor() {
  const schema = store.useStore((state) => state.record?.resource.schema)
  const report = store.useStore((state) => state.report)
  const table = store.useStore((state) => state.table)

  // NOTE: It might be better to move it to the global store for easier debugging
  const [cellSelection, setCellSelection] = React.useState<types.ICellSelection>({})

  // works automatically, doesnt need to be passed to <TableEditor with onKeyPress
  useKeyPress(['delete', 'backspace'], () => {
    store.deleteMultipleCells(cellSelection)
  })

  useKeyPress(['alt+m'], () => {
    store.togglePanel('metadata')
  })

  useKeyPress(['alt+r'], () => {
    store.togglePanel('report')
  })

  useKeyPress(['alt+s'], () => {
    store.togglePanel('source')
  })

  useKeyPress(['ctrl+z'], () => {
    store.undoTableChange()
  })

  useKeyPress(['ctrl+y'], () => {
    store.redoTableChange()
  })

  // TODO: find another shortcut, since this is the default shortcut for closing applicaations
  // on linux and windows at least
  // useKeyPress(['ctrl+q'], () => {
  //   store.revertTable()
  // })

  useKeyPress(['ctrl+s'], () => {
    store.saveTable()
  })

  // Ensure that when the user interact with other parts on the application
  // e.g. Metadata editor the selection logic is not activated
  // also commit current table editing (https://github.com/okfn/opendataeditor/issues/495)
  const onClickAway = () => {
    store.stopTableEditing()
    setCellSelection({})
  }

  if (!schema) return null
  if (!report) return null
  if (!table) return null

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={onClickAway}
    >
      <Box sx={{ height: '100%' }}>
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
          onColumnRename={store.renameColumn}
          handle={(ref) => store.setRefs({ grid: ref })}
        />
      </Box>
    </ClickAwayListener>
  )
}
