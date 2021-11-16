import * as React from 'react'
import { ISchema } from '../../interfaces/schema'
import { IRow } from '../../interfaces/row'
import Table from '../Table'

interface StatusProps {
  schema: ISchema
  rows: IRow
}

export default function Status(props: StatusProps) {
  return <Table schema={props.schema} rows={props.rows} />
}
