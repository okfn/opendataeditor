import * as React from 'react'
import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import { useStore } from '../store'

export default function SystemSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="System" onHeadingClick={() => updateHelp('system')}>
      <OpenaiApiKey />
    </EditorSection>
  )
}

function OpenaiApiKey() {
  const system = useStore((state) => state.descriptor.system)
  const openaiApiKey = useStore((state) => state.descriptor.system.openaiApiKey)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Openai Api Key"
      value={openaiApiKey || ''}
      onChange={(value) =>
        updateDescriptor({ system: { ...system, openaiApiKey: value || undefined } })
      }
    />
  )
}
