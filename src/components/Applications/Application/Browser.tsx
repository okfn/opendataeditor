import * as React from 'react'
import Empty from '../../Parts/Empty'
import Spinner from '../../Parts/Spinner'
import FileTree from '../../Parts/Trees/File'
import { useStore } from './store'

export default function Browser() {
  const files = useStore((state) => state.files)
  const loading = useStore((state) => state.loading)
  return loading ? (
    <LoadingBrowser />
  ) : files.length ? (
    <DefaultBrowser />
  ) : (
    <EmptyBrowser />
  )
}

function DefaultBrowser() {
  const path = useStore((state) => state.path)
  const files = useStore((state) => state.files)
  const fileEvent = useStore((state) => state.fileEvent)
  const selectFile = useStore((state) => state.selectFile)
  return (
    <React.Fragment>
      <FileTree files={files} event={fileEvent} selected={path} onSelect={selectFile} />
    </React.Fragment>
  )
}

function EmptyBrowser() {
  return <Empty title="No Files Added" description='Use "Create" button to add files' />
}

function LoadingBrowser() {
  return <Spinner message="Loading" />
}
