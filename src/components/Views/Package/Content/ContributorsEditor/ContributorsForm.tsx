import * as React from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import InputField from '../../../Library/Fields/InputField'
import CommitButton from '../../../Library/Buttons/CommitButton'
import { useStore } from '../../store'

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
  modalOpen: boolean
  handleClose: (value: boolean) => void
  id?: string
  title?: string
  email?: string
  path?: string
  role?: string
}

export default function ContributorsForm(props: ContributorsFormProps) {
  const { modalOpen, handleClose, id, title, email, path, role } = props

  const [inputTitle, setInputTitle] = React.useState(title || '')
  const [inputEmail, setInputEmail] = React.useState(email || '')
  const [inputPath, setInputPath] = React.useState(path || '')
  const [inputRole, setInputRole] = React.useState(role || '')

  const contributorsList = useStore((state) => state.descriptor.contributors) || []
  const update = useStore((state) => state.update)

  const onAdd = (title: string, email?: string, path?: string, role?: string) => {
    const newContributor = {
      id: Math.floor(Math.random() * (10000 - 0) + 0) + title.slice(0, 3),
      title: title,
      email: email,
      path: path,
      role: role,
    }
    console.log(newContributor)
    const contributors = [newContributor, ...contributorsList]
    update({ contributors })
  }
  const onEdit = (title?: string, email?: string, path?: string, role?: string) => {
    const contributors = contributorsList.map((item) => ({
      id: item.title,
      title: item.id === id ? title : item.title,
      email: item.id === id ? email : item.email,
      path: item.id === id ? path : item.path,
      role: item.id === id ? role : item.role,
    }))
    update({ contributors })
  }

  const handleSubmit = React.useCallback(() => {
    if (inputTitle.length) {
      id
        ? onEdit(inputTitle, inputEmail, inputPath, inputRole)
        : onAdd(inputTitle, inputEmail, inputPath, inputRole)
      setInputTitle('')
      setInputEmail('')
      setInputPath('')
      setInputRole('')
    }
  }, [id, inputTitle, inputEmail, inputPath, inputRole])

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
          <CommitButton onClick={handleSubmit} variant="text" />
        </form>
      </Box>
    </Modal>
  )
}
