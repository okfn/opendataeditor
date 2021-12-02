import * as React from 'react'
import { IResource, IRow } from '../../../interfaces'
import Table from '../../Table'
import File from '../../File'
import { useStore } from '../store'

export default function Data() {
  const isSourceView = useStore((state) => state.isSourceView)
  const resource = useStore((state) => state.resource) as IResource
  const rows = useStore((state) => state.rows) as IRow[]
  const text = useStore((state) => state.text) as string
  // TODO: text might not be available
  if (isSourceView) return <File text={text} />
  return <Table schema={resource.schema} rows={rows} />
}
