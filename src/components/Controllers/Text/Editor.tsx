import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import TextEditor from '../../Editors/Text'
import { useStore, selectors } from './store'

export default function Editor() {
  const language = useStore(selectors.language)
  if (language !== 'markdown') return <Source />
  return (
    <Columns spacing={2} height="100%">
      <Source />
      <Target />
    </Columns>
  )
}

function Source() {
  const modified = useStore((state) => state.modified)
  const editor = useStore((state) => state.editor)
  const language = useStore(selectors.language)
  const updateState = useStore((state) => state.updateState)
  if (modified === undefined) return null
  return (
    <Box sx={{ paddingY: 2, height: '100%' }}>
      <TextEditor
        value={modified}
        language={language}
        onChange={(text) => updateState({ modified: text })}
        onMount={(ref) => {
          // @ts-ignore
          editor.current = ref
        }}
      />
    </Box>
  )
}

function Target() {
  const rendered = useStore((state) => state.rendered)
  if (!rendered) return null
  return (
    <iframe
      height="98%"
      width="100%"
      style={{ border: 0, margin: 0, padding: 0, borderLeft: 'solid 1px #ddd' }}
      srcDoc={rendered}
    ></iframe>
  )
}
