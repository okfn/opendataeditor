import AddButton from './Buttons/Add'
import DeleteButton from './Buttons/Delete'
import ManageButton from './Buttons/Manage'
import * as action from '../Parts/Bars/Action'

export default function Actions() {
  return (
    <action.ActionBar>
      <AddButton />
      <ManageButton />
      <DeleteButton />
    </action.ActionBar>
  )
}
