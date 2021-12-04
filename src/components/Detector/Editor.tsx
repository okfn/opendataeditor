import * as React from 'react'
import Columns from '../Library/Columns'
import Preview from '../Library/Preview'
import Help from './Columns/Help'
import General from './Columns/General'
import Field from './Columns/Field'
import Schema from './Columns/Schema'
import { useStore } from './store'

export default function Editor() {
  const isPreview = useStore((state) => state.isPreview)
  const descriptor = useStore((state) => state.descriptor)
  const exportFormat = useStore((state) => state.exportFormat)
  if (isPreview) return <Preview descriptor={descriptor} format={exportFormat} />
  return (
    <Columns spacing={3}>
      <General />
      <Field />
      <Schema />
      <Help />
    </Columns>
  )
}
