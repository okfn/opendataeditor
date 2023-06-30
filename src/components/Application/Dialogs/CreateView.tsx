import * as React from 'react'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore, selectors } from '../store'

export default function CreateViewDialog() {
  const folderPath = useStore(selectors.folderPath)
  const createView = useStore((state) => state.createView)
  const updateState = useStore((state) => state.updateState)
  const path = folderPath ? `${folderPath}/view.json` : 'view.json'
  return (
    <InputDialog
      open={true}
      value={path}
      title="Create View"
      label="Create"
      description="You are creating a SQL view. Enter destination:"
      placholder="Enter a view path"
      Icon={LeaderboardIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (path) => {
        await createView(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
