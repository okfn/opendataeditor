import * as React from 'react'
import SaveAsDialog from './Dialogs/SaveAs'
import ResourceDialog from './Dialogs/Resource'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  switch (dialog) {
    case 'saveAs':
      return <SaveAsDialog />
    case 'resource':
      return <ResourceDialog />
    default:
      return null
  }
}
