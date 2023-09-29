import DangerousIcon from '@mui/icons-material/Dangerous'
import NoteDialog from '../../../Parts/Dialogs/Note'

export interface LeaveDialogProps {
  onClose: () => void
}

export default function LeaveDialog(props: LeaveDialogProps) {
  return (
    <NoteDialog
      open={true}
      title="Unsaved Changes"
      label="OK"
      Icon={DangerousIcon}
      description="There are unsaved changes. Please save or revert them."
      onCancel={props.onClose}
      onConfirm={props.onClose}
    />
  )
}
