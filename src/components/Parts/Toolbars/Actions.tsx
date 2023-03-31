import * as React from 'react'
import Toolbar from '@mui/material/Toolbar'
import IosShareIcon from '@mui/icons-material/IosShare'
import PublishIcon from '@mui/icons-material/Publish'
import CheckIcon from '@mui/icons-material/Check'
import HistoryIcon from '@mui/icons-material/History'
import IconButton from '../../Parts/Buttons/IconButton'
import Columns from '../../Parts/Columns'

interface ActionsToolbarProps {
  isUpdated?: boolean
  onPublish?: () => void
  onSaveAs?: () => void
  onRevert?: () => void
  onSave?: () => void
}

export default function ActionsToolbar(
  props: React.PropsWithChildren<ActionsToolbarProps>
) {
  const Publish = () => {
    return (
      <IconButton
        label="Publish"
        Icon={PublishIcon}
        variant="outlined"
        disabled={!props.onPublish}
        onClick={props.onPublish}
        sx={{ backgroundColor: 'white' }}
      />
    )
  }

  const SaveAs = () => {
    return (
      <IconButton
        label="Save as"
        Icon={IosShareIcon}
        variant="outlined"
        disabled={!props.onSaveAs}
        onClick={props.onSaveAs}
        sx={{ backgroundColor: 'white' }}
      />
    )
  }

  const Revert = () => {
    return (
      <IconButton
        label="Revert"
        Icon={HistoryIcon}
        color={props.isUpdated ? 'warning' : 'info'}
        variant={props.isUpdated ? 'contained' : 'outlined'}
        disabled={!props.onRevert}
        onClick={props.onRevert}
        sx={{ backgroundColor: 'white' }}
      />
    )
  }

  const Save = () => {
    return (
      <IconButton
        label="Save"
        Icon={CheckIcon}
        color={props.isUpdated ? 'success' : 'info'}
        variant={props.isUpdated ? 'contained' : 'outlined'}
        disabled={!props.onSave}
        onClick={props.onSave}
        sx={{ backgroundColor: 'white' }}
      />
    )
  }

  const DefaultBar = () => {
    return (
      <React.Fragment>
        <Publish />
        <SaveAs />
        <Revert />
        <Save />
      </React.Fragment>
    )
  }

  const CustomBar = () => {
    return <React.Fragment>{props.children}</React.Fragment>
  }

  return (
    <Toolbar sx={{ borderTop: 'solid 1px #ddd', backgroundColor: '#fafafa' }}>
      <Columns spacing={2}>
        {React.Children.count(props.children) ? <CustomBar /> : <DefaultBar />}
      </Columns>
    </Toolbar>
  )
}
