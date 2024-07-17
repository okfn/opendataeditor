import * as action from '../../Parts/Bars/Action'
import * as store from '@client/store'

export default function Action() {
  return (
    <action.ActionBar>
      <action.SaveAsButton onClick={() => store.openDialog('saveAs')} />
      <action.PublishButton disabled />
      <action.RevertButton disabled />
      <action.SaveButton disabled />
    </action.ActionBar>
  )
}
