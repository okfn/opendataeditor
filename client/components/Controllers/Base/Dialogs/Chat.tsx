import * as React from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import EditIcon from '@mui/icons-material/Edit'
import ConfirmDialog from '../../../Parts/Dialogs/Confirm'
import MultilineField from '../../../Parts/Fields/Multiline'

export interface ChatDialogProps {
  type: string
  onEdit: (prompt: string) => Promise<void>
  onClose: () => void
}

export default function ChatDialog(props: ChatDialogProps) {
  const [prompt, setPrompt] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  return (
    <ConfirmDialog
      ctrlEnter
      open={true}
      maxWidth="md"
      title="Edit with Chat AI"
      label="Edit"
      Icon={EditIcon}
      disabled={loading}
      onCancel={props.onClose}
      onConfirm={async () => {
        setLoading(true)
        await props.onEdit(prompt)
        setLoading(false)
        props.onClose()
      }}
    >
      You are editing the {props.type}. Enter Chat AI prompt:
      <MultilineField
        autoFocus
        rows={3}
        label="Prompt"
        value={prompt}
        onChange={setPrompt}
        placeholder="please change something"
      />
      {loading && (
        <Box sx={{ borderTop: 'solid 1px #ddd', paddingY: 2, marginTop: 1 }}>
          Editing
          <LinearProgress />
        </Box>
      )}
    </ConfirmDialog>
  )
}
