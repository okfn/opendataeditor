import * as React from 'react'
import Columns from '../Library/Columns'
import Preview from '../Library/Preview'
import Help from './Columns/Help'
import General from './Columns/General'
import Details from './Columns/Details'
import Stats from './Columns/Stats'
import { useStore } from './store'

export default function Content() {
  const isPreview = useStore((state) => state.isPreview)
  const descriptor = useStore((state) => state.descriptor)
  const exportFormat = useStore((state) => state.exportFormat)
  if (isPreview) return <Preview descriptor={descriptor} format={exportFormat} />
  return (
    <Columns spacing={3} layout={[3, 6, 3]}>
      <General />
      <Details />
      <Help />
    </Columns>
  )
}
