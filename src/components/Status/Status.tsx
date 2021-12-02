import * as React from 'react'
import { ISchema, IRow } from '../../interfaces'
import Table from '../Table'

interface StatusProps {
  schema: ISchema
  rows: IRow
}

export default function Status(props: StatusProps) {
  return <Table schema={props.schema} rows={props.rows} />
}
