import * as action from '../../Parts/Bars/Action'
import * as store from '@client/store'

export default function Action() {
  const isUpdated = store.useStore(store.getIsTableOrResourceUpdated)

  return (
    <action.ActionBar>
      <action.SaveAsButton onClick={() => store.openDialog('saveAs')} />
      <action.PublishButton
        disabled={isUpdated}
        onClick={() => store.openDialog('publish')}
      />
      <action.RevertButton updated={isUpdated} onClick={store.revertTable} />
      <action.SaveButton updated={isUpdated} onClick={store.saveTable} />
    </action.ActionBar>
  )
}
