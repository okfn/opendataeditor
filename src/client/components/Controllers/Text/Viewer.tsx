import * as React from 'react'
import Box from '@mui/material/Box'
import InnerHtml from 'dangerously-set-html-content'
import CodePanel from '../../Parts/Panels/Code'
import ScrollBox from '../../Parts/Boxes/Scroll'
import { useStore } from './store'

export default function Viewer() {
  const type = useStore((state) => state.record?.type)
  const outputedText = useStore((state) => state.outputedText)
  const darkMode = false
  return (
    <ScrollBox
      sx={{
        height: '100%',
        borderLeft: 'solid 1px #ddd',
        backgroundColor: darkMode ? '#333' : undefined,
        color: darkMode ? '#eee' : undefined,
      }}
    >
      {type === 'script' ? (
        <CodePanel>{outputedText}</CodePanel>
      ) : (
        <Box sx={{ paddingX: 2 }}>
          {outputedText && <InnerHtml key={outputedText} html={outputedText} />}
        </Box>
      )}
    </ScrollBox>
  )
}
