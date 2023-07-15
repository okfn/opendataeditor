import * as React from 'react'
import ChatDialog from './Dialogs/Chat'
import PublishDialog from './Dialogs/Publish'
import ResourceDialog from './Dialogs/Resource'
import SaveAsDialog from './Dialogs/SaveAs'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  switch (dialog) {
    case 'chat':
      return <ChatDialog />
    case 'publish':
      return <PublishDialog />
    case 'saveAs':
      return <SaveAsDialog />
    case 'resource':
      return <ResourceDialog />
    default:
      return null
  }
}
