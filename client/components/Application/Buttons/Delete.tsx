import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '../../Parts/Buttons/Icon'
import LightTooltip from '../../Parts/Tooltips/Light'
import { useStore } from '../store'
import { useKeyPress } from 'ahooks'

export default function DeleteButton() {
  const path = useStore((state) => state.path)
  const updateState = useStore((state) => state.updateState)
  useKeyPress(['ctrl.i'], (event) => {
    event.preventDefault()
    if (path) updateState({ dialog: 'deleteFilesFolders' })
  })
  return (
    <LightTooltip title="Delete file [Ctrl+I]">
      <Box>
        <IconButton
          label="Delete"
          Icon={DeleteIcon}
          disabled={!path}
          variant="text"
          color="warning"
          onClick={() => {
            updateState({ dialog: 'deleteFilesFolders' })
          }}
        />
      </Box>
    </LightTooltip>
  )
}
