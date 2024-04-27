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
      description={`Your file is not supported by this tool. Supported data formats: 
        ${supportedFormats.join(', ').toUpperCase()}`}
      onConfirm={() => updateState({ dialog: undefined })}
    />
  )
}
