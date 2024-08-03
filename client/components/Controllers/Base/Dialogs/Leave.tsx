import DangerousIcon from '@mui/icons-material/Dangerous'
import ConfirmDialog from '../../../Parts/Dialogs/Confirm'

export interface LeaveDialogProps {
  onClose: () => void
}

export default function LeaveDialog(props: LeaveDialogProps) {
  return (
    <ConfirmDialog
      open={true}
      title="Unsaved Changes"
      cancelLabel="Discard"
      label="Save"
      Icon={DangerousIcon}
      description="There are unsaved changes. Please click Save or Discard"
      onCancel={props.onClose}
      onConfirm={props.onClose}
    />
  )
}
