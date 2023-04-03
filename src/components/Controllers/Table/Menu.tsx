import * as React from 'react'
import MenuBar from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const setPanel = useStore((state) => state.setPanel)
  return (
    <MenuBar
      items={['metadata', 'source', 'errors']}
      colors={{
        metadata: panel === 'metadata' ? 'warning' : undefined,
        source: panel === 'source' ? 'warning' : undefined,
        errors: panel === 'errors' ? 'warning' : undefined,
      }}
      onMetadata={() => setPanel(panel !== 'metadata' ? 'metadata' : undefined)}
      onSource={() => setPanel(panel !== 'source' ? 'source' : undefined)}
      onErrors={() => setPanel(panel !== 'errors' ? 'errors' : undefined)}
    />
  )
}
