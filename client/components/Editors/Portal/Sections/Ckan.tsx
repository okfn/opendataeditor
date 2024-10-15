import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import YesNoField from '../../../Parts/Fields/YesNo'
import { useStore } from '../store'
import Box from '@mui/material/Box'

export default function CkanSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Ckan" onHeadingClick={() => updateHelp('ckan')}>
      <Box sx={{ display: 'flex' }}>
        <Baseurl />
        <Dataset />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <AllowUpdate />
        <Apikey />
      </Box>
    </EditorSection>
  )
}

function Baseurl() {
  const baseurl = useStore((state) => state.descriptor.ckan?.baseurl)
  const updateCkan = useStore((state) => state.updateCkan)
  return (
    <InputField
      required
      label="Base Url"
      value={baseurl || ''}
      onChange={(value) => updateCkan({ baseurl: value || undefined })}
    />
  )
}

function Dataset() {
  const dataset = useStore((state) => state.descriptor.ckan?.dataset)
  const updateCkan = useStore((state) => state.updateCkan)
  return (
    <InputField
      required
      label="Dataset"
      value={dataset || ''}
      onChange={(value) => updateCkan({ dataset: value || undefined })}
    />
  )
}

function AllowUpdate() {
  const allowUpdate = useStore((state) => state.descriptor.ckan?.allowUpdate)
  const updateCkan = useStore((state) => state.updateCkan)
  return (
    <YesNoField
      label="Allow Update"
      value={allowUpdate || false}
      onChange={(value) => updateCkan({ allowUpdate: value })}
    />
  )
}

function Apikey() {
  const apikey = useStore((state) => state.descriptor.ckan?.apikey)
  const updateCkan = useStore((state) => state.updateCkan)
  return (
    <InputField
      type="password"
      required
      label="API Key"
      value={apikey || ''}
      onChange={(value) => updateCkan({ apikey: value || undefined })}
    />
  )
}
