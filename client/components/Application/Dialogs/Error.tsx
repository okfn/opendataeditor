import NoteDialog from '../../Parts/Dialogs/Note'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useStore } from '../store'

export default function ErrorDialog() {
  const updateState = useStore((state) => state.updateState)
  const error = useStore((state) => state.error)
  if (!error) return null
  return (
    <NoteDialog
      open={true}
      title="Error"
      label="OK"
      Icon={ErrorOutlineIcon}
      description={error.detail}
      onCancel={() => updateState({ dialog: undefined, error: undefined })}
      onConfirm={() => updateState({ dialog: undefined, error: undefined })}
    />
  )
}
