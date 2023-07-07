import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import TabbedDialog from '../../Parts/Dialogs/Tabbed'
import { useStore, selectors } from '../store'

export default function CreateDialog() {
  const updateState = useStore((state) => state.updateState)
  const [type, setType] = React.useState(SECTIONS[0].type)
  const section = SECTIONS.find((section) => section.type === type) || SECTIONS[0]
  const folderPath = useStore(selectors.folderPath)
  const initialPath = folderPath ? `${folderPath}/${section.fileName}` : section.fileName
  const [path, setPath] = React.useState(initialPath)
  return (
    <TabbedDialog
      open={true}
      title="Create New File"
      label="Create"
      maxWidth="md"
      section={type}
      sections={SECTIONS.map((section) => section.type)}
      onSectionChange={setType}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        console.log(type)
        updateState({ dialog: undefined })
      }}
    >
      <Box sx={{ marginBottom: 1, opacity: 0.6 }}>{section.description}</Box>
      <TextField
        autoFocus
        fullWidth
        size="small"
        value={path}
        placeholder={section.placeholder}
        onChange={(ev) => setPath(ev.target.value)}
        sx={{ marginBottom: 1 }}
      />
    </TabbedDialog>
  )
}

const SECTIONS = [
  {
    type: 'article',
    fileName: 'article.md',
    placeholder: 'Enter an article path',
    description: 'You are creating a Markdown article. Enter destination:',
  },
  {
    type: 'chart',
    fileName: 'chart.json',
    placeholder: 'Enter a chart path',
    description: 'You are creating a Vega chart. Enter destination:',
  },
]
