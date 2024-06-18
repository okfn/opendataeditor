import NoteDialog from '../../Parts/Dialogs/Note'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useStore } from '../store'

export default function ErrorDialog() {
  const updateState = useStore((state) => state.updateState)
  return (
    <NoteDialog
      open={true}
      title="Error"
      label="OK"
      Icon={ErrorOutlineIcon}
      description="TODO: error description"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={() => updateState({ dialog: undefined })}
    />
  )
}
