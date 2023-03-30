import * as React from 'react'
import MetadataIcon from '@mui/icons-material/Tune'
import MenuBar, { IMenuBarItem } from '../../Parts/MenuBar'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  const items: IMenuBarItem[] = [
    {
      key: 'metadata',
      label: 'Metadata',
      disabled: false,
      type: 'default',
      icon: <MetadataIcon />,
      color: panel === 'metadata' ? 'warning' : 'info',
      onClick: () =>
        updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined }),
    },
  ]
  return <MenuBar items={items} />
}
