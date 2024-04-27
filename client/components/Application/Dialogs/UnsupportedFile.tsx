import NoteDialog from '../../Parts/Dialogs/Note'
import { useStore } from '../store'

export default function UnsupportedFileDialog() {
  const path = useStore((state) => state.path)
  const updateState = useStore((state) => state.updateState)
  const supportedFormats = ['csv', 'xls', 'json', 'sql']
  if (!path) return null
  return (
    <NoteDialog
      open={true}
      title="Unsupported file"
      label="OK"
      description={`This file format is not supported by the application. \n\n The supported formats are ${supportedFormats.join(', ').toUpperCase()}`}
      onConfirm={() => updateState({ dialog: undefined })}
    />
  )
}
