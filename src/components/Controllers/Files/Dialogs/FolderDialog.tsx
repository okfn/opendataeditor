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
import { Cancel, ContentCopy, CopyAll } from '@mui/icons-material'
import ActionButton from '../../../Parts/ActionButton'

export default function FolderDialog() {
  const targetTree = useStore(selectors.targetTree)
  const dialog = useStore((state) => state.dialog)
  const setDialog = useStore((state) => state.setDialog)
  const copyFile = useStore((state) => state.copyFile)
  const moveFile = useStore((state) => state.moveFile)
  const isFolder = useStore(selectors.isFolder)
  const folderPath = useStore(selectors.folderPath)
  const [target, setTarget] = React.useState(folderPath || '/')
  const handleClose = () => setDialog(undefined)
  const handleSelect = () => {
    const action = dialog === 'folder/copy' ? copyFile : moveFile
    action(target !== '/' ? target : undefined)
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
          selected={target}
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
            <ActionButton label={'Cancel'} icon={Cancel} />
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            variant="contained"
            size="small"
            onClick={handleSelect}
            color="secondary"
          >
            <ActionButton
              label={dialog === 'folder/copy' ? 'Copy' : 'Move'}
              icon={dialog === 'folder/copy' ? CopyAll : ContentCopy}
            />
          </Button>
        </Columns>
      </Box>
    </Dialog>
  )
}
