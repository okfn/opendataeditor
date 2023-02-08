import * as React from 'react'
import FilesContent from './Contents/FilesContent'
import EmptyContent from './Contents/EmptyContent'
import { useStore } from './store'
import SpinnerContent from './Contents/SpinnerContent'

export default function Content() {
  const fileItems = useStore((state) => state.fileItems)
  const loading = useStore((state) => state.loading)
  console.log('loading', loading)
  return fileItems.length ? (
    loading ? (
      <SpinnerContent />
    ) : (
      <FilesContent />
    )
  ) : (
    <EmptyContent />
  )
}
