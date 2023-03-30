import * as React from 'react'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import CodeIcon from '@mui/icons-material/Code'
import MenuBar, { IMenuBarItem } from '../../Parts/MenuBar'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const setPanel = useStore((state) => state.setPanel)
  const items: IMenuBarItem[] = [
    {
      key: 'source',
      label: 'Source',
      type: 'default',
      disabled: false,
      icon: <CodeIcon />,
      color: panel === 'source' ? 'warning' : 'info',
      onClick: () => setPanel(panel !== 'source' ? 'source' : undefined),
    },
    {
      key: 'errors',
      label: 'Errors',
      disabled: false,
      type: 'default',
      icon: <ReportGmailerrorredIcon />,
      color: panel === 'errors' ? 'warning' : 'info',
      onClick: () => setPanel(panel !== 'errors' ? 'errors' : undefined),
    },
  ]
  return <MenuBar items={items} />
}
