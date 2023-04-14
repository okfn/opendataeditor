import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/Input'
import EditorSection from '../../../Parts/Editor/Section'
import Columns from '../../../Parts/Columns'
import { useStore } from '../store'

export default function Resource() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Checksum" onHeadingClick={() => updateHelp('resource/checksum')}>
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
  const hash = useStore((state) => state.descriptor.hash)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Hash"
      value={hash || ''}
      onChange={(value) => updateDescriptor({ hash: value || undefined })}
    />
  )
}

function Bytes() {
  const bytes = useStore((state) => state.descriptor.bytes)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      disabled
      label="Bytes"
      value={bytes || ''}
      onChange={(value) => updateDescriptor({ bytes: value || undefined })}
    />
  )
}

function Fields() {
  const fields = useStore((state) => state.descriptor.fields)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      disabled
      label="Fields"
      value={fields || ''}
      onChange={(value) => updateDescriptor({ fields: value || undefined })}
    />
  )
}

function Rows() {
  const rows = useStore((state) => state.descriptor.rows)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      disabled
      label="Rows"
      value={rows || ''}
      onChange={(value) => updateDescriptor({ fields: value || undefined })}
    />
  )
}
