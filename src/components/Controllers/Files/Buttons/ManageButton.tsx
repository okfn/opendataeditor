import * as React from 'react'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import DropdownButton from '../../../Parts/Buttons/DropdownButton'
import { useStore } from '../store'

export default function ManageButton() {
  return (
    <DropdownButton label="Manage">
      <MoveButton />
      <CopyButton />
    </DropdownButton>
  )
}

function MoveButton() {
  const setDialog = useStore((state) => state.setDialog)
  return <DefaultButton label="Copy" onClick={() => setDialog('move')} />
}

function CopyButton() {
  const setDialog = useStore((state) => state.setDialog)
  return <DefaultButton label="Copy" onClick={() => setDialog('copy')} />
}
