import * as React from 'react'
import Columns from '../../Parts/Columns'
import ActionsBar from '../../Parts/Bars/Actions'
import CreateButton from './Buttons/CreateButton'
import DeleteButton from './Buttons/DeleteButton'
import ManageButton from './Buttons/ManageButton'

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
