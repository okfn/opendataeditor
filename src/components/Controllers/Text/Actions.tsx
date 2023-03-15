import * as React from 'react'
import Box from '@mui/material/Box'
import ExportIcon from '@mui/icons-material/IosShare'
import SaveIcon from '@mui/icons-material/Check'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import CommitButton from '../../Parts/Buttons/CommitButton'
import Columns from '../../Parts/Columns'
import { useStore } from './store'
import { useTheme } from '@mui/material/styles'
import FileSaver from 'file-saver'

export default function Actions() {
  const theme = useTheme()
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: theme.spacing(8), paddingX: 2 }}>
      <Columns spacing={2}>
        <Export />
        <Save />
      </Columns>
    </Box>
  )
}

function Export() {
  const file = useStore((state) => state.file)
  const downloadFile = useStore((state) => state.downloadFile)
  return (
    <DefaultButton
      icon={<ExportIcon fontSize="small" sx={{ mr: 1 }} />}
      label="Export"
      onClick={async () => {
        const bytes = await downloadFile()
        if (bytes && file) {
          const blob = new Blob([bytes])
          const filename = file.path?.split('/').slice(-1).join()
          FileSaver.saveAs(blob, filename)
        }
      }}
    />
  )
}

function Save() {
  const commitChange = useStore((state) => state.commitChange)
  const newFile = useStore((state) => state.newFile)
  return (
    <CommitButton
      disabled={newFile === undefined}
      icon={<SaveIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={commitChange}
    />
  )
}
