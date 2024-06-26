import * as React from 'react'
import PickDialog from '../../../Parts/Dialogs/Pick'
import { useStore } from '../store'
import * as types from '../../../../types'

// TODO: move logic to store
// TODO: move Selector here and make it a proper dialog
export default function Resource() {
  const [paths, setPaths] = React.useState<string[]>([])
  const record = useStore((state) => state.record)
  const client = useStore((state) => state.client)
  const existentPaths = useStore((state) =>
    (state.modified as types.IPackage)!.resources.map((resource) => resource.path)
  )
  const updateState = useStore((state) => state.updateState)
  const addResources = useStore((state) => state.addResources)
  const handleCancel = () => updateState({ dialog: undefined })
  const handleSave = (paths: string[]) => {
    updateState({ dialog: undefined })
    addResources(paths)
  }
  React.useEffect(() => {
    client.fileList().then((result) => {
      if (result instanceof client.Error) {
        return updateState({ error: result })
      }

      const paths = []
      for (const file of result.files) {
        if (existentPaths.includes(file.path)) continue
        if (file.type === 'package') continue
        paths.push(file.path)
      }

      setPaths(paths)
    })
  }, [record])
  return (
    <PickDialog
      open={true}
      title="Select Resources"
      maxWidth="md"
      label="Select"
      items={paths}
      onCancel={handleCancel}
      onConfirm={handleSave}
    />
  )
}
