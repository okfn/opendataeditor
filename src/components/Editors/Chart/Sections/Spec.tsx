import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import EditorSection from '../../../Parts/Editor/EditorSection'
import MonacoEditor from '../../../Parts/Monaco/Editor'
import { useStore } from '../store'

export default function Spec() {
  const theme = useTheme()
  const descriptor = useStore((state) => state.descriptor)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  return (
    <EditorSection name="Descriptor" onHeadingClick={() => updateHelp('spec')}>
      <MonacoEditor
        value={JSON.stringify(descriptor, null, 2)}
        language="json"
        onChange={(text) => updateState({ descriptor: JSON.parse(text || '{)') })}
        height={theme.spacing(34)}
      />
    </EditorSection>
  )
}
