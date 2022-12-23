import * as React from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import InputField from '../../../Library/Fields/InputField'
import CommitButton from '../../../Library/Buttons/CommitButton'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

interface ContributorsFormProps {
  onAdd: (title: string, email?: string, path?: string, role?: string) => void
  modalOpen: boolean
  handleClose: (value: boolean) => void
}

export default function ContributorsForm(props: ContributorsFormProps) {
  const { onAdd, modalOpen, handleClose } = props
  const [inputTitle, setInputTitle] = React.useState('')
  const [inputEmail, setInputEmail] = React.useState('')
  const [inputPath, setInputPath] = React.useState('')
  const [inputRole, setInputRole] = React.useState('')

  const addContributor = React.useCallback(() => {
    if (inputTitle.length) {
      onAdd(inputTitle, inputEmail, inputPath, inputRole)
      setInputTitle('')
      setInputEmail('')
      setInputPath('')
      setInputRole('')
    }
  }, [inputTitle, inputEmail, inputPath, inputRole])

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <form
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <InputField
            size="small"
            label="Name of contributor"
            value={inputTitle}
            onChange={(value) => setInputTitle(value)}
          />
          <InputField
            size="small"
            label="Email"
            value={inputEmail}
            onChange={(value) => setInputEmail(value)}
          />
          <InputField
            size="small"
            label="Link"
            value={inputPath}
            onChange={(value) => setInputPath(value)}
          />
          <InputField
            size="small"
            label="Role"
            value={inputRole}
            onChange={(value) => setInputRole(value)}
          />
          <CommitButton onClick={addContributor} variant="text" />
        </form>
      </Box>
    </Modal>
  )
}
