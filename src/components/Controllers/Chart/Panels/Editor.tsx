import * as React from 'react'
import ChartEditor from '../../../Editors/Chart'
import { useStore } from '../store'

export default function Editor() {
  const fields = useStore((state) => state.fields)
  const updateState = useStore((state) => state.updateState)
  return <ChartEditor fields={fields} onChange={(chart) => updateState({ chart })} />
}
