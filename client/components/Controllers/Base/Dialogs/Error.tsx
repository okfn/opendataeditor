import NoteDialog from '../../../Parts/Dialogs/Note'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export default function ErrorDialog(props: { detail: string; onClose: () => void }) {
  return (
    <NoteDialog
      open={true}
      title="Error"
      label="OK"
      Icon={ErrorOutlineIcon}
      description={props.detail}
      onCancel={props.onClose}
      onConfirm={props.onClose}
    />
  )
}
