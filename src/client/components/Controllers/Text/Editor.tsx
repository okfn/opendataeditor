import * as React from 'react'
import Box from '@mui/material/Box'
import SpinnerCard from '../../Parts/Cards/Spinner'
import TextEditor from '../../Editors/Text'
import { useStore, selectors } from './store'
import * as helpers from './helpers'

export default function Editor() {
  const [visibility, setVisibility] = React.useState('hidden')
  const modifiedText = useStore((state) => state.modifiedText)
  const editorRef = useStore((state) => state.editorRef)
  const language = useStore(selectors.language)
  const updateState = useStore((state) => state.updateState)
  const maximalVersion = useStore((state) => state.maximalVersion)
  const render = useStore((state) => state.render)
  if (modifiedText === undefined) return null
  return (
    <React.Fragment>
      {visibility === 'hidden' && <SpinnerCard message="Loading" />}
      <Box sx={{ paddingY: 2, height: '100%', visibility }}>
        <TextEditor
          value={modifiedText}
          language={language}
          onChange={(text) => {
            const version = helpers.getVersion(editorRef.current)
            updateState({
              modifiedText: text,
              currentVersion: version,
              maximalVersion: Math.max(version, maximalVersion),
            })
            render()
          }}
          onMount={(editor) => {
            // @ts-ignore
            editorRef.current = editor
            setVisibility('visible')
          }}
        />
      </Box>
    </React.Fragment>
  )
}
