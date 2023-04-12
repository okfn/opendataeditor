import * as React from 'react'
import ChartEditor from '../../../Editors/Chart'
import { useStore } from '../store'

export default function Editor() {
  const fields = useStore((state) => state.fields)
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  return (
    <ChartEditor
      chart={modified}
      fields={fields}
      onChange={(chart) => updateState({ modified: chart })}
    />
  )
}
