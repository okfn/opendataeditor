import * as action from '../../Parts/Bars/Action'
import { useStore, selectors } from './store'
import * as store from '@client/store'

export default function Action() {
  const isUpdated = useStore(selectors.isUpdated)
  const revert = useStore((state) => state.revert)
  const save = useStore((state) => state.save)
  return (
    <action.ActionBar>
      <action.SaveAsButton onClick={() => store.openDialog('saveAs')} />
      <action.PublishButton
        disabled={isUpdated}
        onClick={() => store.openDialog('publish')}
      />
      <action.RevertButton updated={isUpdated} onClick={revert} />
      <action.SaveButton updated={isUpdated} onClick={save} />
    </action.ActionBar>
  )
}
