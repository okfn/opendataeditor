import '@inovua/reactdatagrid-community/index.css'
import * as React from 'react'
import SpinnerCard from '../../Parts/Cards/Spinner'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InovuaDatagrid from '@inovua/reactdatagrid-community'
import { TypeDataGridProps } from '@inovua/reactdatagrid-community/types'
import { TypeComputedProps } from '@inovua/reactdatagrid-community/types'
import { createColumns } from './columns'
import * as settings from './settings'
import * as types from '../../../types'
import debounce from 'lodash/debounce'

export type ITableEditor = TypeComputedProps | null
export interface TableEditorProps extends Partial<TypeDataGridProps> {
  source: types.ITableLoader | types.IRow[]
  schema: types.ISchema
  report?: types.IReport
  history?: types.IHistory
  selection?: types.ITableSelection
}

export default function TableEditor(props: TableEditorProps) {
  const { source, schema, report, history, selection, ...others } = props
  const columns = React.useMemo(
    () => createColumns(schema, report, history, selection),
    [schema, report, history, selection]
  )
  const [rowsPerPage, setRowsPerPage] = React.useState(20)

  const [rowHeight] = React.useState(40)

  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      resizeTable()
    }, 300)
    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })

  function resizeTable() {
    // using a query selector here and not a ref because the tableRef selects the whole
    // table including the bottom pagination bar, so we would still need to use a querySelector
    // for selecting the pagination bar to get its height
    // see: https://github.com/okfn/opendataeditor/pull/364#discussion_r1589574167
    const tableElement = document.querySelector('.InovuaReactDataGrid__column-layout')
    const tableHeight = tableElement?.clientHeight as number
    // - 1 because we dont include header row
    setRowsPerPage(Math.floor(tableHeight / rowHeight) - 1)
  }

  const elem = document.querySelector('.css-neb4x5-MuiGrid-root')
  const rect = elem?.getBoundingClientRect()

  return (
    <InovuaDatagrid
      onReady={resizeTable}
      idProperty="_rowNumber"
      dataSource={source}
      columns={columns}
      pagination={true}
      loadingText={<Typography>Loading...</Typography>}
      renderLoadMask={LoadMask}
      defaultActiveCell={settings.DEFAULT_ACTIVE_CELL}
      style={{ height: '100%', border: 'none' }}
      limit={rowsPerPage}
      onLimitChange={setRowsPerPage}
      rowHeight={rowHeight}
      showColumnMenuLockOptions={false}
      showColumnMenuGroupOptions={false}
      columnContextMenuConstrainTo={rect}
      {...others}
    />
  )
}

function LoadMask(props: { visible: boolean; zIndex: number }) {
  if (!props.visible) return null
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        opacity: 0.6,
        background: 'rgba(121, 134, 203, 0.25)',
        zIndex: props.zIndex,
      }}
    >
      <SpinnerCard message="Loading" />
    </Box>
  )
}
