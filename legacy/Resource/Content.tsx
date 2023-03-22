import * as React from 'react'
import Columns from '../../Parts/Columns'
import Preview from '../../Parts/Preview'
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
    <Columns spacing={3}>
      <General />
      <Details />
      <Stats />
      <Help />
    </Columns>
  )
}
