import * as React from 'react'
import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import { useStore, selectors, select } from '../store'

export default function GithubSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Github" onHeadingClick={() => updateHelp('github')}>
      <User />
      <Repo />
      <Apikey />
    </EditorSection>
  )
}

function User() {
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const user = useStore(select(selectors.github, (descriptor) => descriptor?.user))
  return (
    <InputField
      required
      label="User"
      value={user || ''}
      onChange={(value) => updateDescriptor({ user: value || undefined })}
    />
  )
}

function Repo() {
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const repo = useStore(select(selectors.github, (descriptor) => descriptor?.repo))
  return (
    <InputField
      required
      label="Repo"
      value={repo || ''}
      onChange={(value) => updateDescriptor({ repo: value || undefined })}
    />
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
      onChange={(value) => updateDescriptor({ apikey: value })}
    />
  )
}
