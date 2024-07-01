import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '../../Parts/Buttons/Icon'
import LightTooltip from '../../Parts/Tooltips/Light'
import * as store from '@client/store'
import { useKeyPress } from 'ahooks'

export default function DeleteButton() {
  const path = store.useStore((state) => state.path)
  const isFolder = store.useStore(store.getIsFolder)

  const type = isFolder ? 'Folder' : 'File'
  useKeyPress(['ctrl.i'], (event) => {
    event.preventDefault()
    if (path) store.openDialog(`delete${type}`)
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
          onClick={() => store.openDialog(`delete${type}`)}
        />
      </Box>
    </LightTooltip>
  )
}
