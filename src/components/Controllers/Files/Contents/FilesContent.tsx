import * as React from 'react'
import FileTree from '../../../Parts/Trees/FileTree'
import { useStore, selectors } from '../store'

export default function FilesContent() {
  const path = useStore((state) => state.path)
  const fileTree = useStore(selectors.fileTree)
  const setPath = useStore((state) => state.setPath)
  const fileItemAdded = useStore((state) => state.fileItemAdded)
  const setFileItemAdded = useStore((state) => state.setFileItemAdded)
  return (
    <FileTree
      tree={fileTree}
      selected={path}
      fileItemAdded={fileItemAdded}
      onPathChange={setPath}
      onFileItemAdd={setFileItemAdded}
    />
  )
}
