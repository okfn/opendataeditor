import * as React from 'react'
import type { ITextEditor } from '@client/components/Editors/Text'
import Box from '@mui/material/Box'
import SpinnerCard from '../../Parts/Cards/Spinner'
import TextEditor from '../../Editors/Text'
import * as store from '@client/store'

export default function Editor() {
  const [visibility, setVisibility] = React.useState('hidden')

  const contents = store.useStore((state) => state.text?.contents)
  const language = store.useStore(store.getTextLanguage)
  const maximalVersion = store.useStore((state) => state.text?.maximalVersion)
  if (contents === undefined || !maximalVersion) return null

  return (
    <React.Fragment>
      {visibility === 'hidden' && <SpinnerCard message="Loading" />}
      <Box sx={{ paddingY: 2, height: '100%', visibility }}>
        <TextEditor
          value={contents}
          language={language}
          onChange={store.updateText}
          onMount={(current) => {
            const editor = React.createRef<ITextEditor | undefined>()
            // @ts-ignore
            editor.current = current
            store.setRefs({ editor })
            setVisibility('visible')
          }}
        />
      </Box>
    </React.Fragment>
  )
}
