import * as React from 'react'
import Delete from '@mui/icons-material/Delete'
import MenuBar from '../../Parts/Monaco/MenuBar'
import { useStore } from './store'

export default function Menu() {
  const clear = useStore((state) => state.clear)
  const items = [
    {
      key: 'clear',
      label: 'Clear',
      disabled: false,
      type: 'default',
      icon: <Delete />,
      onClick: clear,
    },
  ]
  return <MenuBar items={items} />
}
