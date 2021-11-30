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

  // Components

  const Editor = () => {
    if (isPreview) return <PreviewMode />
    return <NormalMode />
  }

  const NormalMode = () => (
    <Columns spacing={3} layout={[3, 6, 3]}>
      <General />
      <Elements />
      <Help />
    </Columns>
  )

  const PreviewMode = () => (
    <Preview descriptor={descriptor} format={exportFormat} height="352px" />
  )

  return <Editor />
}
