import * as React from 'react'
import Source from '../../Views/Source'
import { useStore } from './store'

export default function Content() {
  const path = useStore((state) => state.record.path)
  const source = useStore((state) => state.source)
  const loadSource = useStore((state) => state.loadSource)
  React.useEffect(() => {
    loadSource().catch(console.error)
  }, [path])
  if (!source) return null
  return <Source source={source} />
}
