import '@inovua/reactdatagrid-community/index.css'
import * as React from 'react'
import Spinner from '../../Parts/Spinner'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InovuaDatagrid from '@inovua/reactdatagrid-community'
import { TypeDataGridProps } from '@inovua/reactdatagrid-community/types'
import { TypeComputedProps } from '@inovua/reactdatagrid-community/types'
import { createColumns } from './columns'
import * as settings from './settings'
import * as types from '../../../types'

export type IDataGrid = TypeComputedProps | null
export interface DataGridProps extends Partial<TypeDataGridProps> {
  source: types.ITableLoader | types.IRow[]
  schema: types.ISchema
  report?: types.IReport
  history?: types.IHistory
}

export default function DataGrid(props: DataGridProps) {
  const { source, schema, report, history, ...others } = props
  const columns = React.useMemo(
    () => createColumns(schema, report, history),
    [schema, report, history]
  )
  return (
    <InovuaDatagrid
      idProperty="_rowNumber"
      dataSource={source}
      columns={columns}
      pagination={true}
      loadingText={<Typography>Loading...</Typography>}
      renderLoadMask={LoadMask}
      defaultActiveCell={settings.DEFAULT_ACTIVE_CELL}
      style={{ height: '100%', border: 'none' }}
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
      <Spinner message="Loading" />
    </Box>
  )
}
