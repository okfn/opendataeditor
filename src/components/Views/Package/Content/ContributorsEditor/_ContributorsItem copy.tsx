import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Library/Fields/InputField'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined'

interface ContributorsItemProps {
  name: string
  id: string
  onEdit: (id: string, title: string) => void
  onDelete: (id: string) => void
}
export default function ContributorsItem({
  name,
  id,
  onEdit,
  onDelete,
}: ContributorsItemProps) {
  const [editMode, setEditMode] = React.useState(false)
  const [value, setValue] = React.useState(name)

  return (
    <ListItem disablePadding dense={false}>
      {editMode ? (
        <Box
          key={id}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <InputField
            size="small"
            label="edit"
            value={value}
            onChange={(name: string) => setValue(name)}
          />
          <DoneOutlineOutlinedIcon
            color="primary"
            sx={{
              marginLeft: '20px',
              fontSize: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&: hover': { opacity: 0.7 },
            }}
            onClick={() => {
              onEdit(id, value)
              setEditMode(false)
            }}
          />
          <DeleteOutlineOutlinedIcon
            color="primary"
            sx={{
              marginLeft: '20px',
              fontSize: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&: hover': { opacity: 0.7 },
            }}
            onClick={() => onDelete(id)}
          />
        </Box>
      ) : (
        <ListItemButton>
          <ListItemText primary={name} />
          <ModeEditOutlineOutlinedIcon
            color="primary"
            sx={{
              fontSize: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&: hover': { opacity: 0.7 },
            }}
            onClick={() => setEditMode(true)}
          />
          <DeleteOutlineOutlinedIcon
            color="primary"
            sx={{
              marginLeft: '20px',
              fontSize: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&: hover': { opacity: 0.7 },
            }}
            onClick={() => onDelete(id)}
          />
        </ListItemButton>
      )}
    </ListItem>
  )
}
