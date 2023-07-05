import * as React from 'react'
import ChartEditor from '../../../Editors/Chart'
import { useStore } from '../store'

export default function Editor() {
  const columns = useStore((state) => state.columns)
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  return (
    <ChartEditor
      chart={modified}
      columns={columns}
      onChange={(chart) => updateState({ modified: chart })}
    />
  )
}
