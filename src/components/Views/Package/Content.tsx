import * as React from 'react'
import Columns from '../Library/Columns'
import Preview from '../Library/Preview'
import Help from './Content/Help'
// import General from './Content/General'
// import Element from './Content/Element'
import { useStore } from './store'
import PackageNavigation from './Navigation/PackageNavigation'

export default function Content() {
  const isPreview = useStore((state) => state.isPreview)
  const descriptor = useStore((state) => state.descriptor)
  const exportFormat = useStore((state) => state.exportFormat)
  if (isPreview) return <Preview descriptor={descriptor} format={exportFormat} />
  return (
    <Columns spacing={3} layout={[9, 3]}>
      <PackageNavigation />
      {/* <General /> */}
      {/* <Element /> */}
      <Help />
    </Columns>
  )
}
