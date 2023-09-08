import * as React from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import UploadIcon from '@mui/icons-material/Upload'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

type IState = 'form' | 'load' | 'done' | 'fail'

export default function AddRemoteDatasetDialog() {
  const fetchPackage = useStore((state) => state.fetchPackage)
  const updateState = useStore((state) => state.updateState)
  const [state, setState] = React.useState<IState>('form')
  return (
    <InputDialog
      open={true}
      title="Add Remote Dataset"
      label="Add"
      Icon={UploadIcon}
      description="You can add a Ckan, Github, or Zenodo dataset link:"
      placholder="Enter or paste an URL"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (url) => {
        setState('load')
        await fetchPackage(url)
        setState('done')
        updateState({ dialog: undefined })
      }}
    >
      {state === 'load' && (
        <Box sx={{ borderTop: 'solid 1px #ddd', marginTop: 1, paddingY: 2 }}>
          Adding
          <LinearProgress />
        </Box>
      )}
    </InputDialog>
  )
}
