import * as React from 'react'
import { TextSourcePanel } from '../../Base/Panels/Source'
import { useStore } from '../store'

export default function Source() {
  const record = useStore((state) => state.record)
  const source = useStore((state) => state.source)
  const loadSource = useStore((state) => state.loadSource)
  React.useEffect(() => {
    loadSource().catch(console.error)
  }, [record])
  if (!source) return null
  return <TextSourcePanel value={source} />
}
