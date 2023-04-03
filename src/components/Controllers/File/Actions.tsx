import * as React from 'react'
import ActionsBar from '../../Parts/Bars/Actions'
import { useStore } from './store'

export default function Actions() {
  const updateState = useStore((state) => state.updateState)
  return <ActionsBar onSaveAs={() => updateState({ dialog: 'saveAs' })} />
}
