import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import VerticalTabs from '../../Parts/Tabs/Vertical'
import { useStore, selectors } from '../store'

interface IConfig {
  path: string
  prompt: string
  action: any
}

export default function CreateDialog() {
  const updateState = useStore((state) => state.updateState)
  const [config, setConfig] = React.useState<IConfig | null>()
  return (
    <ConfirmDialog
      open={true}
      title="Create New File"
      label="Create"
      maxWidth="md"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        updateState({ dialog: undefined })
      }}
    >
      <VerticalTabs labels={['Article', 'Catalog']} disabledLabels={['Catalog']}>
        <ArticleConfig />
      </VerticalTabs>
    </ConfirmDialog>
  )
}

function ArticleConfig() {
  return (
    <Config
      fileName="article.md"
      placeholder="Enter an article path"
      description="You are creating a Markdown article. Enter destination:"
    />
  )
}

interface ConfigProps {
  fileName: string
  placeholder: string
  description: string
  onChange: (value: string) => void
}

function Config(props: ConfigProps) {
  const folderPath = useStore(selectors.folderPath)
  const path = folderPath ? `${folderPath}/${props.fileName}` : props.fileName
  return (
    <Box>
      <Box sx={{ marginBottom: 1, opacity: 0.6 }}>{props.description}</Box>
      <TextField
        autoFocus
        fullWidth
        size="small"
        value={path}
        placeholder={props.placeholder}
        onChange={(ev) => props.onChange(ev.target.value)}
        sx={{ marginBottom: 1 }}
      />
    </Box>
  )
}
