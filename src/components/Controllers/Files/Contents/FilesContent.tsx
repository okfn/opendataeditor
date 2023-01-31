import * as React from 'react'
import FileTree from '../../../Parts/Trees/FileTree'
import { useStore, selectors } from '../store'

export default function FilesContent() {
  const path = useStore((state) => state.path)
  const fileTree = useStore(selectors.fileTree)
  const setPath = useStore((state) => state.setPath)
  return <FileTree tree={fileTree} path={path} onPathChange={setPath} />
}
