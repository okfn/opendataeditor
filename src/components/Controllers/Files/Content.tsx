import * as React from 'react'
import Empty from '../../Parts/Empty'
import SpinnerContent from '../../Parts/SpinnerContent'
import FileTree from '../../Parts/Trees/FileTree'
import { useStore, selectors } from './store'

export default function Content() {
  const fileItems = useStore((state) => state.fileItems)
  const loading = useStore((state) => state.loading)
  console.log('loading', loading)
  return loading ? (
    <SpinnerContent />
  ) : fileItems.length ? (
    <FilesContent />
  ) : (
    <EmptyContent />
  )
}

function FilesContent() {
  const path = useStore((state) => state.path)
  const fileTree = useStore(selectors.fileTree)
  const setPath = useStore((state) => state.setPath)
  const fileItemAdded = useStore((state) => state.fileItemAdded)
  const setFileItemAdded = useStore((state) => state.setFileItemAdded)
  return (
    <FileTree
      tree={fileTree}
      selected={path}
      onPathChange={setPath}
      fileItemAdded={fileItemAdded}
      onFileItemAdd={setFileItemAdded}
    />
  )
}

function EmptyContent() {
  return <Empty title="No Files Added" description='Use "Create" button to add files' />
}
