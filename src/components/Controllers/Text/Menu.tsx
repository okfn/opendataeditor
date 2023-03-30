import * as React from 'react'
import Compress from '@mui/icons-material/Compress'
import DataObject from '@mui/icons-material/DataObject'
import Delete from '@mui/icons-material/Delete'
import Handyman from '@mui/icons-material/Handyman'
import MenuBar, { IMenuBarItem } from '../../Parts/MenuBar'
import { useStore, selectors } from './store'

export default function Menu() {
  const language = useStore(selectors.language)
  const clear = useStore((state) => state.clear)
  const fix = useStore((state) => state.fix)
  const minify = useStore((state) => state.minify)
  const prettify = useStore((state) => state.prettify)
  let items: IMenuBarItem[] = [
    {
      key: 'clear',
      label: 'Clear',
      disabled: false,
      type: 'default',
      icon: <Delete />,
      onClick: clear,
    },
  ]
  if (language === 'json') {
    items = [
      ...items,
      {
        key: 'fix',
        label: 'Fix',
        disabled: false,
        type: 'default',
        icon: <Handyman />,
        onClick: fix,
      },
      {
        key: 'minify',
        label: 'Minify',
        disabled: false,
        type: 'default',
        icon: <Compress />,
        onClick: minify,
      },
      {
        key: 'prettify',
        label: 'Prettify',
        disabled: false,
        type: 'default',
        icon: <DataObject />,
        onClick: prettify,
      },
    ]
  }
  return <MenuBar items={items} />
}
