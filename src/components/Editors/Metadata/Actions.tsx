import * as React from 'react'
import Box from '@mui/material/Box'
import DownloadIcon from '@mui/icons-material/Download'
import MenuIcon from '@mui/icons-material/Menu'
import CodeIcon from '@mui/icons-material/Code'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import ImportButton from '../../Parts/Buttons/ImportButton'
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
  const importDescriptor = useStore((state) => state.importDescriptor)
  return <ImportButton disabled={!editor} onImport={(value) => importDescriptor(value)} />
}

function Export() {
  const editor = useStore((state) => state.editorState.editor)
  const exportDescriptor = useStore((state) => state.exportDescriptor)
  return (
    <DefaultButton
      label="Export"
      disabled={!editor}
      icon={<DownloadIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={exportDescriptor}
    />
  )
}

function Preview() {
  const editor = useStore((state) => state.editorState.editor)
  const isPreview = useStore((state) => state.editorState.isPreview)
  const updateEditorState = useStore((state) => state.updateEditorState)
  return (
    <DefaultButton
      label="Preview"
      disabled={!editor}
      color={isPreview ? 'warning' : 'info'}
      icon={<CodeIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => updateEditorState({ isPreview: !isPreview })}
    />
  )
}
