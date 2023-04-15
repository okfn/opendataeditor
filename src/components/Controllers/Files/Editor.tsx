import * as React from 'react'
import Empty from '../../Parts/Empty'
import Spinner from '../../Parts/Spinner'
import FileTree from '../../Parts/Trees/File'
import { useStore, selectors } from './store'

export default function Editor() {
  const fileItems = useStore((state) => state.fileItems)
  const loading = useStore((state) => state.loading)
  return loading ? (
    <LoadingContent />
  ) : fileItems.length ? (
    <FilesContent />
  ) : (
    <EmptyContent />
  )
}

function LoadingContent() {
  return <Spinner />
}

function FilesContent() {
  const path = useStore((state) => state.path)
  const fileTree = useStore(selectors.fileTree)
  const fileEvent = useStore((state) => state.fileEvent)
  const updatePath = useStore((state) => state.updatePath)
  return (
    <React.Fragment>
      <FileTree
        tree={fileTree}
        event={fileEvent}
        onSelect={updatePath}
        defaultSelected={path}
      />
    </React.Fragment>
  )
}

function EmptyContent() {
  return <Empty title="No Files Added" description='Use "Create" button to add files' />
}
