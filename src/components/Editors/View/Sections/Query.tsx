import * as React from 'react'
import EditorSection from '../../../Parts/Editor/Section'
import MonacoEditor from '../../../Parts/Monaco/Editor'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FieldTree from '../../../Parts/Trees/Field'
import EditorSearch from '../../../Parts/Editor/Search'
import ScrollBox from '../../../Parts/ScrollBox'
import Columns from '../../../Parts/Columns'
import { useTheme } from '@mui/material/styles'
import { useStore, selectors } from '../store'

export default function Query() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <Columns>
      <EditorSection name="Query" onHeadingClick={() => updateHelp('query')}>
        <QueryEditor />
      </EditorSection>
      <QueryFields />
    </Columns>
  )
}

function QueryEditor() {
  const theme = useTheme()
  const query = useStore((state) => state.descriptor.query)
  const editorRef = useStore((state) => state.editorRef)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <MonacoEditor
      height={theme.spacing(34)}
      value={query}
      language="sql"
      onChange={(text) => updateDescriptor({ query: text })}
      onMount={(ref) => {
        // @ts-ignore
        editorRef.current = ref
        editorRef.current.focus()
      }}
    />
  )
}

function QueryFields() {
  const theme = useTheme()
  // TODO: currently, we make it controlled just because it fixes field selection background color
  const [selected, setSelected] = React.useState<string>()
  const fieldTree = useStore(selectors.fieldTree)
  const editorRef = useStore((state) => state.editorRef)
  const searchTerm = useStore((state) => state.searchTerm)
  const updateState = useStore((state) => state.updateState)
  if (!fieldTree) return null
  return (
    <Box sx={{ borderLeft: 'solid 1px #ddd', height: '100%' }}>
      <Box sx={{ padding: 2, borderBottom: 'solid 1px #ddd' }}>
        <Columns layout={[6, 6]}>
          <Typography variant="h4">Fields</Typography>
          <EditorSearch
            value={searchTerm || ''}
            onChange={(value) => updateState({ searchTerm: value })}
          />
        </Columns>
      </Box>
      <ScrollBox height={theme.spacing(34)}>
        <FieldTree
          tree={fieldTree}
          selected={selected}
          onPathChange={setSelected}
          onPathDoubleClick={(path) => {
            if (editorRef.current) {
              editorRef.current.trigger('keyboard', 'type', { text: `"${path}"` })
              editorRef.current.focus()
            }
          }}
        />
      </ScrollBox>
    </Box>
  )
}
