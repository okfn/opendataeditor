import * as React from 'react'
import SourcePanel from '../../Base/Panels/Source'
import { useStore } from '../store'

export default function Source() {
  const textSource = useStore((state) => state.textSource)
  if (!textSource) return null
  return <SourcePanel value={textSource} />
}
