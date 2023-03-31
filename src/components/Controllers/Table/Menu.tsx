import * as React from 'react'
import MenuBar from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const setPanel = useStore((state) => state.setPanel)
  return (
    <MenuBar
      items={['source', 'errors']}
      colors={{
        source: panel === 'source' ? 'warning' : undefined,
        errors: panel === 'errors' ? 'warning' : undefined,
      }}
      onSource={() => setPanel(panel !== 'source' ? 'source' : undefined)}
      onErrors={() => setPanel(panel !== 'errors' ? 'errors' : undefined)}
    />
  )
}
