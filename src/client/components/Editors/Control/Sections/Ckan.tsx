import * as React from 'react'
import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import YesNoField from '../../../Parts/Fields/YesNo'
import { useStore, selectors, select } from '../store'

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
  const baseurl = useStore(select(selectors.ckan, (descriptor) => descriptor?.baseurl))
  return (
    <InputField
      required
      label="Base Url"
      value={baseurl || ''}
      onChange={(value) => updateDescriptor({ baseurl: value || undefined })}
    />
  )
}

function Dataset() {
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const dataset = useStore(select(selectors.ckan, (descriptor) => descriptor?.dataset))
  return (
    <InputField
      required
      label="Dataset"
      value={dataset || ''}
      onChange={(value) => updateDescriptor({ dataset: value || undefined })}
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
      onChange={(value) => updateDescriptor({ apikey: value || undefined })}
    />
  )
}

function AllowUpdate() {
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const allowUpdate = useStore(
    select(selectors.ckan, (descriptor) => descriptor?.allowUpdate)
  )
  return (
    <YesNoField
      label="Allow Update"
      value={allowUpdate || false}
      onChange={(value) => updateDescriptor({ allowUpdate: value })}
    />
  )
}
