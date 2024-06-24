import NoteDialog from './/Note'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export default function Error(props: { detail: string; onClose: () => void }) {
  return (
    <NoteDialog
      open={true}
      title="Error"
      label="OK"
      color="error"
      Icon={ErrorOutlineIcon}
      description={props.detail}
      onCancel={props.onClose}
      onConfirm={props.onClose}
    />
  )
}
