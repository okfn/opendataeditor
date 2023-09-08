import * as React from 'react'
import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import { useStore } from '../store'

export default function ProjectSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Project" onHeadingClick={() => updateHelp('project')}>
      <Name />
    </EditorSection>
  )
}

function Name() {
  const project = useStore((state) => state.descriptor.project)
  const name = useStore((state) => state.descriptor.project.name)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Name"
      value={name || ''}
      onChange={(value) =>
        updateDescriptor({ project: { ...project, name: value || undefined } })
      }
    />
  )
}
