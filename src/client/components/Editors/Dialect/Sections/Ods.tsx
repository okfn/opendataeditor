import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Grids/Columns'
import InputField from '../../../Parts/Fields/Input'
import EditorSection from '../../Base/Section'
import * as settings from '../../../../settings'
import { useStore, selectors, select } from '../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Ods" onHeadingClick={() => updateHelp('excel')}>
      <Columns spacing={3}>
        <Box>
          <Sheet />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Sheet() {
  const sheet = useStore(select(selectors.ods, (ods) => ods.sheet))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateOds = useStore((state) => state.updateOds)
  return (
    <InputField
      label="Sheet"
      value={sheet || settings.DEFAULT_SHEET}
      onFocus={() => updateHelp('ods/sheet')}
      onChange={(value) => updateOds({ sheet: value || undefined })}
    />
  )
}
