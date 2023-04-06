import * as React from 'react'
import MenuBar, { MenuBarItem } from '../../Parts/Bars/Menu'

export default function Menu() {
  const items: MenuBarItem[] = ['metadata', 'report', 'source', 'clear']
  return <MenuBar items={items} />
}
