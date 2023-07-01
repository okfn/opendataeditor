import * as React from 'react'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore, selectors } from '../store'

export default function CreateChartDialog() {
  const folderPath = useStore(selectors.folderPath)
  const createChart = useStore((state) => state.createChart)
  const updateState = useStore((state) => state.updateState)
  const path = folderPath ? `${folderPath}/chart.json` : 'chart.json'
  return (
    <InputDialog
      open={true}
      value={path}
      title="Create Chart"
      label="Create"
      description="You are creating a Vega chart. Enter destination:"
      placholder="Enter a chart path"
      Icon={LeaderboardIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (path) => {
        await createChart(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
