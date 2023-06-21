import * as React from 'react'
import CreateButton from './Buttons/Create'
import DeleteButton from './Buttons/Delete'
import ManageButton from './Buttons/Manage'
import * as action from '../Parts/Bars/Action'

export default function Actions() {
  return (
    <action.ActionBar>
      <CreateButton />
      <ManageButton />
      <DeleteButton />
    </action.ActionBar>
  )
}
