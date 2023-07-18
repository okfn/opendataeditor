import * as React from 'react'
import EditorSection from '../../Base/Section'
import MultilineField from '../../../Parts/Fields/Multiline'
import InputField from '../../../Parts/Fields/Input'
import { useStore } from '../store'

export default function ZenodoSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Zenodo" onHeadingClick={() => updateHelp('zenodo')}>
      <Title />
      <Description />
      <Author />
      <Apikey />
    </EditorSection>
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.zenodo?.title)
  const updateZenodo = useStore((state) => state.updateZenodo)
  return (
    <InputField
      required
      label="Title"
      value={title || ''}
      onChange={(value) => updateZenodo({ title: value || undefined })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.zenodo?.description)
  const updateZenodo = useStore((state) => state.updateZenodo)
  return (
    <MultilineField
      required
      label="Description"
      value={description || ''}
      onChange={(value) => updateZenodo({ description: value || undefined })}
    />
  )
}

function Author() {
  const author = useStore((state) => state.descriptor.zenodo?.author)
  const updateZenodo = useStore((state) => state.updateZenodo)
  return (
    <InputField
      required
      label="Author"
      value={author || ''}
      onChange={(value) => updateZenodo({ author: value || undefined })}
    />
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
