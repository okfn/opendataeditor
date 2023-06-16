import * as React from 'react'
import * as action from '../../Parts/Bars/Action'
import { useStore, selectors } from './store'

export default function Action() {
  const updateState = useStore((state) => state.updateState)
  const isUpdated = useStore(selectors.isUpdated)
  const revert = useStore((state) => state.revert)
  const save = useStore((state) => state.save)
  return (
    <action.ActionBar>
      <action.SaveAsButton onClick={() => updateState({ dialog: 'saveAs' })} />
      <action.PublishButton disabled />
      <action.RevertButton updated={isUpdated} onClick={revert} />
      <action.SaveButton updated={isUpdated} onClick={save} />
    </action.ActionBar>
  )
}
