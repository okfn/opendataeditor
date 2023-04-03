import * as React from 'react'
import Resource from '../../../Editors/Resource'
import { useStore } from '../store'

export default function MetadataPanel() {
  const file = useStore((state) => state.file)
  const updateResource = useStore((state) => state.updateResource)
  if (!file.record) return null
  return (
    <Resource
      isShallow
      resource={file.record.resource}
      onChange={(resource) => updateResource(resource)}
    />
  )
}
