import * as React from 'react'
import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import YesNoField from '../../../Parts/Fields/YesNo'
import { useStore } from '../store'

export default function CkanSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Ckan" onHeadingClick={() => updateHelp('ckan')}>
      <Baseurl />
      <Dataset />
      <Apikey />
      <AllowUpdate />
    </EditorSection>
  )
}

function Baseurl() {
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const baseurl = useStore((state) => state.descriptor?.baseurl)
  return (
    <InputField
      required
      label="Base Url"
      value={baseurl || ''}
      onChange={(value) => updateDescriptor({ baseurl: value })}
    />
  )
}

function Dataset() {
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const dataset = useStore((state) => state.descriptor?.dataset)
  return (
    <InputField
      required
      label="Dataset"
      value={dataset || ''}
      onChange={(value) => updateDescriptor({ dataset: value })}
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

function AllowUpdate() {
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const allowUpdate = useStore((state) => state.descriptor?.allowUpdate)
  return (
    <YesNoField
      label="Allow Update"
      value={allowUpdate || false}
      onChange={(value) => updateDescriptor({ allowUpdate: value })}
    />
  )
}
