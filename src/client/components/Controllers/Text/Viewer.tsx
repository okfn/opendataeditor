import * as React from 'react'
import CodePanel from '../../Parts/Panels/Code'
import ScrollBox from '../../Parts/Boxes/Scroll'
import IframeBox from '../../Parts/Boxes/Iframe'
import { useStore } from './store'

export default function Viewer() {
  const type = useStore((state) => state.record?.type)
  const outputedText = useStore((state) => state.outputedText)
  const darkMode = false
  return (
    <React.Fragment>
      {type === 'script' ? (
        <ScrollBox
          sx={{
            height: '100%',
            backgroundColor: darkMode ? '#333' : undefined,
            color: darkMode ? '#eee' : undefined,
          }}
        >
          <CodePanel>{outputedText}</CodePanel>
        </ScrollBox>
      ) : (
        <IframeBox html={outputedText || ''} height="100%" />
      )}
    </React.Fragment>
  )
}
