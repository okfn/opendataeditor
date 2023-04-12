import * as React from 'react'
import ConfigDialog from './Dialogs/Config'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  switch (dialog) {
    case 'config':
      return <ConfigDialog />
    default:
      return null
  }
}
