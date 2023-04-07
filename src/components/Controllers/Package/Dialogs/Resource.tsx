import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Selector from '../../../Parts/Selector'
import { useStore } from '../store'

// TODO: move logic to store
// TODO: move Selector here and make it a proper dialog
export default function Resource() {
  const [paths, setPaths] = React.useState<string[]>([])
  const file = useStore((state) => state.file)
  const client = useStore((state) => state.client)
  const dialog = useStore((state) => state.dialog)
  const existentPaths = useStore((state) =>
    state.modified!.resources.map((resource) => resource.path)
  )
  const updateState = useStore((state) => state.updateState)
  const addResources = useStore((state) => state.addResources)
  const handleCancel = () => updateState({ dialog: undefined })
  const handleSave = (paths: string[]) => {
    updateState({ dialog: undefined })
    addResources(paths)
  }
  React.useEffect(() => {
    client.fileList().then(({ items }) => {
      const paths = []
      for (const item of items) {
        if (existentPaths.includes(item.path)) continue
        if (item.type === 'package') continue
        paths.push(item.path)
      }
      setPaths(paths)
    })
  }, [file])
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={dialog === 'resource'}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Select Resources</DialogTitle>
      <Selector items={paths} onCancel={handleCancel} onSelect={handleSave} />
    </Dialog>
  )
}
