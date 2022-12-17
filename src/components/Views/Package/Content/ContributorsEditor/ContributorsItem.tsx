import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Library/Fields/InputField'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined'

interface ContributorsItemProps {
  name: string
  id?: string | undefined
  onEdit?: (id: string, title: string) => void
  onDelete?: (id: string) => void
}
export default function ContributorsItem(props: ContributorsItemProps) {
  const { name, id } = props
  const [editMode, setEditMode] = React.useState(true)
  const [value, setValue] = React.useState(name)

  return (
    <ListItem disablePadding key={id} dense={true}>
      {editMode ? (
        <Box
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
            onKeyDown={() => {
              //   e.key === 'Enter' && onEdit(id, value)
              setEditMode(false)
            }}
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
            //   onClick={() => onDelete(id)}
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
            //   onClick={() => onDelete(id)}
          />
        </ListItemButton>
      )}
    </ListItem>
  )
}
