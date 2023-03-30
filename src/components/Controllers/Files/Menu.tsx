import * as React from 'react'
import MetadataIcon from '@mui/icons-material/Tune'
import MenuBar, { IMenuBarItem } from '../../Parts/MenuBar'

export default function Menu() {
  const items: IMenuBarItem[] = [
    {
      key: 'project',
      label: 'Project',
      options: ['default'],
      disabled: true,
      type: 'select',
      icon: <MetadataIcon />,
      onClick: () => console.log('project'),
    },
  ]
  return <MenuBar items={items} />
}
