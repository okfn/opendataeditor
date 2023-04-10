import * as React from 'react'
import ChartDialog from './Dialogs/Chart'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  switch (dialog) {
    case 'chart':
      return <ChartDialog />
    default:
      return null
  }
}
