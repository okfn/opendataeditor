import * as React from 'react'
import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import { useStore } from '../store'

export default function ZenodoSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Zenodo" onHeadingClick={() => updateHelp('zenodo')}>
      <Apikey />
    </EditorSection>
  )
}

function Apikey() {
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const apikey = useStore((state) => state.descriptor?.apikey)
  return (
    <InputField
      required
      label="API Key"
      value={apikey || ''}
      onChange={(value) => updateDescriptor({ apikey: value || undefined })}
    />
  )
}
