import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/InputField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import { useStore } from '../store'

export default function Resource() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection
      name="Checksums"
      onHeadingClick={() => updateHelp('resource/checksums')}
    >
      <Columns spacing={3}>
        <Box>
          <Hash />
          <Bytes />
        </Box>
        <Box>
          <Fields />
          <Rows />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Hash() {
  const sha256 = useStore((state) => state.resource.hash)
  return <InputField disabled label="Hash" value={sha256} />
}

function Bytes() {
  const bytes = useStore((state) => state.resource.bytes)
  return <InputField disabled label="Bytes" value={bytes} />
}

function Fields() {
  const fields = useStore((state) => state.resource.fields)
  return <InputField disabled label="Fields" value={fields} />
}

function Rows() {
  const rows = useStore((state) => state.resource.rows)
  return <InputField disabled label="Rows" value={rows} />
}
