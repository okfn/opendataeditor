import * as React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Button, Divider, Grid, Typography } from '@mui/material'
import { AddLink, FilterList, Folder } from '@mui/icons-material'
import { DriveFolderUploadRounded, UploadFileRounded } from '@mui/icons-material'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import ViewIcon from '@mui/icons-material/Storage'
import ChartIcon from '@mui/icons-material/Leaderboard'
import { useStore } from '../store'
import { IAction } from '../../../interfaces'

interface WelcomeProps {
  open?: boolean
}

export default function WelcomeDialog(props: WelcomeProps) {
  const [open, setOpen] = React.useState<boolean>(false)
  const setInitialAction = useStore((state) => state.setInitialAction)
  const handleClick = (action: IAction) => {
    setInitialAction(action)
    setOpen(false)
  }
  React.useEffect(() => setOpen(props.open ?? false), [props.open])
  return (
    <Dialog fullWidth aria-labelledby="welcome-dialog" open={open}>
      <DialogContent>
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
              onClick={() => handleClick('upload/link')}
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
              onClick={() => handleClick('create/folder')}
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
              icon={ViewIcon}
              label="Create SQL View"
              onClick={() => handleClick('create/sql')}
            />
          </Grid>
          <Grid container item xs={12} sm={6} md={4}>
            <CustomIconButton
              icon={ChartIcon}
              label="Create Chart"
              onClick={() => handleClick('create/chart')}
            />
          </Grid>
          <Grid container item xs={12} sm={6} md={4}>
            <CustomIconButton
              icon={FilterList}
              label="Create Pipeline"
              onClick={() => handleClick('create/pipeline')}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

const CustomIconButton = (props: {
  label: string
  icon: React.ElementType
  onClick: () => void
}) => {
  const { icon: Icon, label, onClick } = props
  return (
    <Button
      fullWidth
      sx={{ margin: 1, display: 'block', '& .MuiSvgIcon-root,p': { width: '100%' } }}
      variant="outlined"
      size="large"
      onClick={() => onClick()}
    >
      <Icon fontSize="large" />
      <Typography>{label}</Typography>
    </Button>
  )
}
