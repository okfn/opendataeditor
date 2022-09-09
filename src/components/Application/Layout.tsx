import * as React from 'react'
import Columns from '../Library/Columns'
import Project from '../Project'
import Browser from '../Browser'
import { useStore } from './store'

export default function Layout() {
  const path = useStore((state) => state.path)
  const client = useStore((state) => state.client)
  const selectPath = useStore((state) => state.selectPath)
  const ensureClient = useStore((state) => state.ensureClient)
  React.useEffect(() => {
    ensureClient().catch(console.error)
  }, [])
  if (!client) return null
  return (
    <Columns layout={[3, 9]}>
      <Project client={client} onPathChange={selectPath} />
      <Browser client={client} path={path} />
    </Columns>
  )
}
