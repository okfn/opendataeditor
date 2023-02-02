import * as React from 'react'
import FilesContent from './Contents/FilesContent'
import EmptyContent from './Contents/EmptyContent'
import { useStore } from './store'

export default function Content() {
  const fileItems = useStore((state) => state.fileItems)
  return fileItems.length ? <FilesContent /> : <EmptyContent />
}
