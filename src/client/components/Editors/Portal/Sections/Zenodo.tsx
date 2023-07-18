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
  const apikey = useStore((state) => state.descriptor.zenodo?.apikey)
  const updateZenodo = useStore((state) => state.updateZenodo)
  return (
    <InputField
      required
      label="API Key"
      value={apikey || ''}
      onChange={(value) => updateZenodo({ apikey: value || undefined })}
    />
  )
}
