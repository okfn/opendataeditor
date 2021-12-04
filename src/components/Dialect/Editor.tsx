import * as React from 'react'
import Columns from '../Library/Columns'
import Preview from '../Library/Preview'
import Reading from './Columns/Reading'
import Parsing from './Columns/Parsing'
import Loading from './Columns/Loading'
import Help from './Columns/Help'
import { useStore } from './store'

export default function Editor() {
  const isPreview = useStore((state) => state.isPreview)
  const descriptor = useStore((state) => state.descriptor)
  const exportFormat = useStore((state) => state.exportFormat)
  if (isPreview) return <Preview descriptor={descriptor} format={exportFormat} />
  return (
    <Columns spacing={3}>
      <Reading />
      <Parsing />
      <Loading />
      <Help />
    </Columns>
  )
}
