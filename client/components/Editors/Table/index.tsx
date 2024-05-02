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
  const [setPageSizes, pageSizes] = React.useState<number[]>([])

  function makePageSizesArray( numberToCompareAgainst : number ){
    const newPageSizes = [numberToCompareAgainst]
    const array = [5, 10, 20, 50, 100].map( ( n: number ) => ( n > numberToCompareAgainst ? n : newPageSizes.push(n) ) );
    // setPageSizes(array as number[]); // TODO : fix
    return array;
  }

  function loaded(){
    const tableHeight = document.querySelector('.InovuaReactDataGrid__column-layout')?.clientHeight || 0
    // TODO: get cellHeight properly
    // add on resize event
    const cellHeight = document.querySelector('.InovuaReactDataGrid__cell')?.clientHeight || 1
    // 38 is the current height of the cell by default 
    // - 1 because we dont include header row
    setRowsPerPage( Math.floor(tableHeight / 38) - 1 )
    // makePageSizesArray( Math.floor(tableHeight / 38) - 1 )
  }
  return (
    <InovuaDatagrid
      onReady={loaded}
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
      // pageSizes={pageSizes}
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
