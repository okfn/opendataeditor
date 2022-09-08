import * as React from 'react'
import Source from '../../Source'
import { useStore } from '../store'

export default function SourceView() {
  const source = useStore((state) => state.source)
  if (!source) return null
  return <Source source={source} />
}
