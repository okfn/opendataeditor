import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import { DialogContent } from '@mui/material'
import FileTree from '../../../Parts/Trees/FileTree'
import { useStore, selectors } from '../store'

export default function FolderDialog() {
  const [target, setTarget] = React.useState('')
  const targetTree = useStore(selectors.targetTree)
  const dialog = useStore((state) => state.dialog)
  const setDialog = useStore((state) => state.setDialog)
  const copyFile = useStore((state) => state.copyFile)
  const moveFile = useStore((state) => state.moveFile)
  const isFolder = useStore(selectors.isFolder)
  const handleClose = () => setDialog(undefined)
  const handleSelect = () => {
    const action = dialog === 'folder/copy' ? copyFile : moveFile
    action(target)
    setDialog(undefined)
  }
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleClose}
      open={!!dialog && dialog.startsWith('folder/')}
    >
      <DialogTitle>
        {dialog === 'folder/copy' ? 'Copy' : 'Move'} {isFolder ? 'Folder' : 'File'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          borderStyle: 'dotted',
          borderWidth: 1,
          borderRadius: 1,
          marginLeft: 3,
          marginRight: 3,
        }}
      >
        <FileTree
          tree={targetTree}
          expanded={[targetTree[0].path]}
          onPathChange={setTarget}
        />
      </DialogContent>
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            variant="contained"
            size="small"
            onClick={handleClose}
            color="warning"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            variant="contained"
            size="small"
            onClick={handleSelect}
            disabled={!target}
            color="secondary"
          >
            {dialog === 'folder/copy' ? 'Copy' : 'Move'}
          </Button>
        </Columns>
      </Box>
    </Dialog>
  )
}
