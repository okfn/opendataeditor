import * as action from '../../Parts/Bars/Action'
import * as store from '@client/store'

export default function Action() {
  const isUpdated = store.useStore(store.getIsTextOrResourceUpdated)

  return (
    <action.ActionBar>
      <action.SaveAsButton onClick={() => store.openDialog('saveAs')} />
      <action.PublishButton disabled />
      <action.RevertButton updated={isUpdated} onClick={store.revertText} />
      <action.SaveButton updated={isUpdated} onClick={store.saveText} />
    </action.ActionBar>
  )
}
