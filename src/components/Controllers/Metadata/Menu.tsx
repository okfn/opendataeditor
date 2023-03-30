import * as React from 'react'
import FormatClear from '@mui/icons-material/FormatClear'
import CodeIcon from '@mui/icons-material/Code'
import MenuBar, { IMenuBarItem } from '../../Parts/MenuBar'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  const clear = useStore((state) => state.clear)
  const items: IMenuBarItem[] = [
    {
      key: 'clear',
      label: 'Clear',
      disabled: false,
      type: 'default',
      icon: <FormatClear />,
      onClick: clear,
    },
    {
      key: 'preview',
      label: 'Preview',
      type: 'default',
      disabled: false,
      icon: <CodeIcon />,
      color: panel === 'preview' ? 'warning' : 'info',
      onClick: () => updateState({ panel: panel !== 'preview' ? 'preview' : undefined }),
    },
  ]
  return <MenuBar items={items} />
}
