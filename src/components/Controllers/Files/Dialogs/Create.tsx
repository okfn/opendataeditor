import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddLink from '@mui/icons-material/AddLink'
import Close from '@mui/icons-material/Close'
import FilterList from '@mui/icons-material/FilterList'
import Folder from '@mui/icons-material/Folder'
import UploadFileRounded from '@mui/icons-material/UploadFileRounded'
import DriveFolderUploadRounded from '@mui/icons-material/DriveFolderUploadRounded'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import { useStore } from '../store'

export default function CreateDialog() {
  const dialog = useStore((state) => state.dialog)
  const setAction = useStore((state) => state.setAction)
  const setDialog = useStore((state) => state.setDialog)
  const handleClose = () => setDialog(undefined)
  const handleClick = (action: any) => {
    setAction(action)
    setDialog(action)
  }
  return (
    <Dialog fullWidth open={!!dialog && dialog.startsWith('create/')}>
      <DialogContent>
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <Grid container>
          <Grid container item xs={12} sm={6} md={4}>
            <CustomIconButton
              icon={UploadFileRounded}
              label="Upload File"
              onClick={() => handleClick('upload/file')}
            />
          </Grid>
          <Grid container item xs={12} sm={6} md={4}>
            <CustomIconButton
              icon={AddLink}
              label="Upload Link"
              onClick={() => handleClick('link/create')}
            />
          </Grid>
          <Grid container item xs={12} sm={6} md={4}>
            <CustomIconButton
              icon={DriveFolderUploadRounded}
              label="Upload Folder"
              onClick={() => handleClick('upload/folder')}
            />
          </Grid>
        </Grid>
        <Divider
          sx={{
            marginTop: 1,
            marginBottom: 1,
            marginX: '-3%',
            borderStyle: 'dashed',
            overflow: 'hidden',
          }}
        />
        <Grid container>
          <Grid container item xs={12} sm={6} md={4}>
            <CustomIconButton
              icon={CreateNewFolderIcon}
              label="Create Folder"
              onClick={() => handleClick('name/create')}
            />
          </Grid>
          <Grid container item xs={12} sm={6} md={4}>
            <CustomIconButton
              icon={Folder}
              label="Create Package"
              onClick={() => handleClick('create/package')}
            />
          </Grid>
          <Grid container item xs={12} sm={6} md={4}>
            <CustomIconButton
              icon={FilterList}
              label="Create Pipeline"
              onClick={() => handleClick('create/pipeline')}
              disabled={true}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

// TODO: use from Parts
const CustomIconButton = (props: {
  label: string
  icon: React.ElementType
  onClick: () => void
  disabled?: boolean
}) => {
  const { icon: Icon, label, onClick } = props
  return (
    <Button
      fullWidth
      sx={{ margin: 1, display: 'block', '& .MuiSvgIcon-root,p': { width: '100%' } }}
      variant="outlined"
      size="large"
      onClick={() => onClick()}
      disabled={props.disabled}
    >
      <Icon fontSize="large" />
      <Typography>{label}</Typography>
    </Button>
  )
}
