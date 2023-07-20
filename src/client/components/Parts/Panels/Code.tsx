import * as React from 'react'
import ScrollBox from '../Boxes/Scroll'

export interface CodePanelProps {
  children: React.ReactNode
}

export default function CodePanel(props: CodePanelProps) {
  return (
    <ScrollBox
      sx={{ padding: 2, fontSize: '14px', backgroundColor: '#333', color: '#eee' }}
    >
      <pre style={{ margin: 0 }}>
        <code>{props.children}</code>
      </pre>
    </ScrollBox>
  )
}
