import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/Input'
import EditorSection from '../../../Parts/Editor/EditorSection'
import * as settings from '../../../../settings'
import { useStore, selectors, select } from '../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Html" onHeadingClick={() => updateHelp('html')}>
      <Columns spacing={3}>
        <Box>
          <Selector />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Selector() {
  const selector = useStore(select(selectors.html, (html) => html.selector))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateHtml = useStore((state) => state.updateHtml)
  return (
    <InputField
      label="Selector"
      value={selector || settings.DEFAULT_SELECTOR}
      onFocus={() => updateHelp('html/selector')}
      onChange={(value) => updateHtml({ selector: value || undefined })}
    />
  )
}
