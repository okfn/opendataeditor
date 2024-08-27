import * as action from '../../Parts/Bars/Action'

export default function Action() {
  return (
    <action.ActionBar>
      <action.PublishButton disabled />
      <action.SaveButton disabled />
    </action.ActionBar>
  )
}
