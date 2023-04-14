import * as React from 'react'
import Columns from '../../Parts/Columns'
import ActionsBar from '../../Parts/Bars/Actions'
import CreateButton from './Buttons/Create'
import DeleteButton from './Buttons/Delete'
import ManageButton from './Buttons/Manage'

export default function Actions() {
  return (
    <ActionsBar>
      <Columns spacing={2}>
        <CreateButton />
        <ManageButton />
        <DeleteButton />
      </Columns>
    </ActionsBar>
  )
}
