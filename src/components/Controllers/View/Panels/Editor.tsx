import * as React from 'react'
import ViewEditor from '../../../Editors/View'
import { useStore } from '../store'

export default function ConfigPanel() {
  const fields = useStore((state) => state.fields)
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  return (
    <ViewEditor
      view={modified}
      fields={fields}
      onChange={(view) => updateState({ modified: view })}
    />
  )
}
