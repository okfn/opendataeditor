import * as React from 'react'
import Toolbar from '@mui/material/Toolbar'
import IosShareIcon from '@mui/icons-material/IosShare'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CheckIcon from '@mui/icons-material/Check'
import HistoryIcon from '@mui/icons-material/History'
import IconButton from '../../Parts/Buttons/Icon'
import Columns from '../../Parts/Columns'

export type ActionsBarItem = 'saveAs' | 'publish' | 'revert' | 'save'

interface ActionsBarProps {
  labels?: { [key in ActionsBarItem]?: 'string' | undefined }
  isUpdated?: boolean
  onPublish?: () => void
  onSaveAs?: () => void
  onRevert?: () => void
  onSave?: () => void
}

// TODO: use React.useMemo for better performance/animation
export default function ActionsBar(props: React.PropsWithChildren<ActionsBarProps>) {
  const SaveAs = () => {
    return (
      <IconButton
        label={props.labels?.saveAs || 'Save As'}
        Icon={SaveAltIcon}
        variant="outlined"
        disabled={!props.onSaveAs}
        onClick={() => props.onSaveAs!()}
        sx={{ backgroundColor: 'white' }}
      />
    )
  }

  const Publish = () => {
    return (
      <IconButton
        label={props.labels?.publish || 'Publish'}
        Icon={IosShareIcon}
        variant="outlined"
        disabled={!props.onPublish}
        onClick={() => props.onPublish!()}
        sx={{ backgroundColor: 'white' }}
      />
    )
  }

  const Revert = () => {
    return (
      <IconButton
        label={props.labels?.revert || 'Revert'}
        Icon={HistoryIcon}
        color={props.isUpdated ? 'warning' : undefined}
        variant={props.isUpdated ? 'contained' : 'outlined'}
        disabled={!props.onRevert || !props.isUpdated}
        onClick={() => props.onRevert!()}
        sx={{ backgroundColor: !props.isUpdated ? 'white' : undefined }}
      />
    )
  }

  const Save = () => {
    return (
      <IconButton
        label={props.labels?.save || 'Save'}
        Icon={CheckIcon}
        variant={props.isUpdated ? 'contained' : 'outlined'}
        disabled={!props.onSave || !props.isUpdated}
        onClick={() => props.onSave!()}
        sx={{ backgroundColor: !props.isUpdated ? 'white' : undefined }}
      />
    )
  }

  const DefaultBar = () => {
    return (
      <Columns spacing={2}>
        <SaveAs />
        <Publish />
        <Revert />
        <Save />
      </Columns>
    )
  }

  const CustomBar = () => {
    return <Columns spacing={2}>{props.children}</Columns>
  }

  return (
    <Toolbar
      disableGutters
      sx={{ borderTop: 'solid 1px #ddd', backgroundColor: '#fafafa', paddingX: 2 }}
    >
      {React.Children.count(props.children) ? <CustomBar /> : <DefaultBar />}
    </Toolbar>
  )
}
