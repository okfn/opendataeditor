import * as action from '../../Parts/Bars/Action'
import * as store from '@client/store'

export default function Action() {
  const isUpdated = store.useStore(store.getIsTextOrResourceUpdated)

  return (
    <action.ActionBar>
      <action.PublishButton disabled />
      <action.SaveButton updated={isUpdated} onClick={store.saveText} />
    </action.ActionBar>
  )
}
