import * as React from 'react'
import Table from '../../Editors/Table'
import { useStore } from './store'

export default function Editor() {
  const schema = useStore((state) => state.record?.resource.schema)
  const report = useStore((state) => state.report)
  const loader = useStore((state) => state.loader)
  const patch = useStore((state) => state.patch)
  const updateState = useStore((state) => state.updateState)
  const mode = useStore((state) => state.mode)
  if (!schema) return null
  if (!report) return null
  return (
    <Table
      mode={mode}
      source={loader}
      schema={schema}
      report={report}
      patch={patch}
      onErrorClick={(error) => updateState({ error, dialog: 'error' })}
    />
  )
}
