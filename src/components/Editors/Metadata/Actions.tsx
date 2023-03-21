import * as React from 'react'
import Box from '@mui/material/Box'
import DownloadIcon from '@mui/icons-material/Download'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import MenuIcon from '@mui/icons-material/Menu'
import CodeIcon from '@mui/icons-material/Code'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import Columns from '../../Parts/Columns'
import { useStore } from './store'

export default function Actions() {
  // TODO: instead of 63px use proper calculation: theme.spacing(8) - 1px
  return (
    <Box
      sx={{
        borderTop: 'solid 1px #ddd',
        lineHeight: '63px',
        paddingX: 2,
      }}
    >
      <Columns spacing={2}>
        <Menu />
        <Import />
        <Export />
        <Preview />
      </Columns>
    </Box>
  )
}

function Menu() {
  const editor = useStore((state) => state.editorState.editor)
  const updateEditorState = useStore((state) => state.updateEditorState)
  return (
    <DefaultButton
      disabled={!editor}
      icon={<MenuIcon fontSize="small" sx={{ mr: 1 }} />}
      label="Menu"
      onClick={() => updateEditorState({ editor: undefined })}
    />
  )
}

function Import() {
  const editor = useStore((state) => state.editorState.editor)
  return (
    <DefaultButton
      disabled={!editor}
      icon={<FileUploadIcon fontSize="small" sx={{ mr: 1 }} />}
      label="Import"
      onClick={() => {}}
    />
  )
}

function Export() {
  const editor = useStore((state) => state.editorState.editor)
  return (
    <DefaultButton
      disabled={!editor}
      icon={<DownloadIcon fontSize="small" sx={{ mr: 1 }} />}
      label="Export"
    />
  )
}

function Preview() {
  const editor = useStore((state) => state.editorState.editor)
  return (
    <DefaultButton
      disabled={!editor}
      icon={<CodeIcon fontSize="small" sx={{ mr: 1 }} />}
      label="Preview"
    />
  )
}
