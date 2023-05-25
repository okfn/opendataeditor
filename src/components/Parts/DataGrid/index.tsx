import '@inovua/reactdatagrid-community/index.css'
import * as React from 'react'
import InovuaDatagrid from '@inovua/reactdatagrid-community'
import { TypeDataGridProps } from '@inovua/reactdatagrid-community/types'
import { TypeComputedProps } from '@inovua/reactdatagrid-community/types'
import { ISchema, IReport, ITablePatch, ITableLoader, IRow } from '../../../interfaces'
import { createColumns } from './columns'
import * as settings from './settings'

export type IDataGrid = TypeComputedProps | null
export interface DataGridProps extends Partial<TypeDataGridProps> {
  source: ITableLoader | IRow[]
  schema: ISchema
  report?: IReport
  patch?: ITablePatch
}

export default function DataGrid(props: DataGridProps) {
  const { source, schema, report, patch, ...others } = props
  const columns = React.useMemo(
    () => createColumns(schema, report, patch),
    [schema, report, patch]
  )
  return (
    <InovuaDatagrid
      idProperty="_rowNumber"
      dataSource={source}
      columns={columns}
      pagination={true}
      defaultActiveCell={settings.DEFAULT_ACTIVE_CELL}
      style={{ height: '100%', border: 'none' }}
      {...others}
    />
  )
}
