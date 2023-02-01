import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import { useTheme } from '@mui/material/styles'
import CreateButton from './Buttons/CreateButton'
import DeleteButton from './Buttons/DeleteButton'
import ManageButton from './Buttons/ManageButton'
import FilesContent from './Contents/FilesContent'
import EmptyContent from './Contents/EmptyContent'
import FolderDialog from './Dialogs/FolderDialog'
import NameDialog from './Dialogs/NameDialog'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const fileItems = useStore((state) => state.fileItems)
  const listFiles = useStore((state) => state.listFiles)
  const dialog = useStore((state) => state.dialog)
  React.useEffect(() => {
    // TODO: add loading state?
    listFiles().catch(console.error)
  }, [])
  return (
    <React.Fragment>
      {dialog && dialog.startsWith('folder/') && <FolderDialog />}
      {dialog && dialog.startsWith('name/') && <NameDialog />}
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height }}>
          {fileItems.length ? <FilesContent /> : <EmptyContent />}
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: '63px' }}>
            <Columns spacing={2}>
              <CreateButton />
              <ManageButton />
              <DeleteButton />
            </Columns>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  )
}
