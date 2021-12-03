import * as React from 'react'
import Columns from '../Library/Columns'
import Preview from '../Library/Preview'
import Help from './Help'
import General from './General'
import Elements from './Elements'
import { useStore } from './store'

export default function Editor() {
  const isPreview = useStore((state) => state.isPreview)
  const descriptor = useStore((state) => state.descriptor)
  const exportFormat = useStore((state) => state.exportFormat)
  if (isPreview) return <Preview descriptor={descriptor} format={exportFormat} />
  return (
    <Columns spacing={3} layout={[3, 6, 3]}>
      <General />
      <Elements />
      <Help />
    </Columns>
  )
}
