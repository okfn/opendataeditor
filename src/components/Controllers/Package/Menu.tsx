import * as React from 'react'
import MenuBar from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  const clear = useStore((state) => state.clear)
  return (
    <MenuBar
      items={['clear', 'preview']}
      colors={{ preview: panel === 'preview' ? 'warning' : undefined }}
      onClear={clear}
      onPreview={() =>
        updateState({ panel: panel !== 'preview' ? 'preview' : undefined })
      }
    />
  )
}
