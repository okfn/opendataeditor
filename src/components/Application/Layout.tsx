import * as React from 'react'
import Columns from '../Library/Columns'
import Project from '../Project'
import Browser from '../Browser'
import { useStore } from './store'

// TODO: merge with app?
// TODO: add transition animation

export default function Layout() {
  const path = useStore((state) => state.path)
  const session = useStore((state) => state.session)
  const selectPath = useStore((state) => state.selectPath)
  const ensureProject = useStore((state) => state.ensureProject)
  React.useEffect(() => {
    ensureProject().catch(console.error)
  }, [])
  if (!session) return null
  return (
    <Columns layout={[3, 9]}>
      <Project session={session} onPathChange={selectPath} />
      <Browser session={session} path={path} />
    </Columns>
  )
}
