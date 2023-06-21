import * as React from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import MenuIcon from '@mui/icons-material/Menu'
import CodeIcon from '@mui/icons-material/Code'
import IconButton from '../../Parts/Buttons/Icon'
import ImportButton from '../../Parts/Buttons/Import'
import { useStore } from './store'
import * as action from '../../Parts/Bars/Action'

export default function Actions() {
  return (
    <action.ActionBar>
      <Menu />
      <Import />
      <Export />
      <Preview />
    </action.ActionBar>
  )
}

function Menu() {
  const editor = useStore((state) => state.editor)
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      label="Menu"
      Icon={MenuIcon}
      disabled={!editor}
      variant="outlined"
      onClick={() => updateState({ editor: undefined })}
      sx={{ backgroundColor: 'white' }}
    />
  )
}

function Import() {
  const editor = useStore((state) => state.editor)
  const importDescriptor = useStore((state) => state.importDescriptor)
  return (
    <ImportButton
      disabled={!editor}
      onImport={(value) => importDescriptor(value)}
      sx={{ backgroundColor: 'white' }}
    />
  )
}

function Export() {
  const editor = useStore((state) => state.editor)
  const exportDescriptor = useStore((state) => state.exportDescriptor)
  return (
    <IconButton
      label="Export"
      Icon={DownloadIcon}
      variant="outlined"
      disabled={!editor}
      onClick={exportDescriptor}
      sx={{ backgroundColor: 'white' }}
    />
  )
}

function Preview() {
  const editor = useStore((state) => state.editor)
  const isPreview = useStore((state) => state.isPreview)
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      label="Preview"
      Icon={CodeIcon}
      variant="outlined"
      disabled={!editor}
      color={isPreview ? 'warning' : undefined}
      onClick={() => updateState({ isPreview: !isPreview })}
      sx={{ backgroundColor: 'white' }}
    />
  )
}
