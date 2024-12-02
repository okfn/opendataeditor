import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import YesNoField from '../../../Parts/Fields/YesNo'
import { useStore } from '../store'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

export default function CkanSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection onHeadingClick={() => updateHelp('ckan')}>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Baseurl />
        <Dataset />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <AllowUpdate />
        <Apikey />
      </Box>
    </EditorSection>
  )
}

function Baseurl() {
  const { t } = useTranslation()
  const baseurl = useStore((state) => state.descriptor.ckan?.baseurl)
  const updateCkan = useStore((state) => state.updateCkan)
  return (
    <InputField
      required
      label={t('base-url')}
      value={baseurl || ''}
      onChange={(value) => updateCkan({ baseurl: value || undefined })}
    />
  )
}

function Dataset() {
  const dataset = useStore((state) => state.descriptor.ckan?.dataset)
  const updateCkan = useStore((state) => state.updateCkan)
  const { t } = useTranslation()
  return (
    <InputField
      required
      label={t('dataset')}
      value={dataset || ''}
      onChange={(value) => updateCkan({ dataset: value || undefined })}
    />
  )
}

function AllowUpdate() {
  const allowUpdate = useStore((state) => state.descriptor.ckan?.allowUpdate)
  const updateCkan = useStore((state) => state.updateCkan)
  const { t } = useTranslation()
  return (
    <YesNoField
      label={t('allow-update')}
      value={allowUpdate || false}
      onChange={(value) => updateCkan({ allowUpdate: value })}
    />
  )
}

function Apikey() {
  const apikey = useStore((state) => state.descriptor.ckan?.apikey)
  const updateCkan = useStore((state) => state.updateCkan)
  const { t } = useTranslation()
  return (
    <InputField
      type="password"
      required
      label={t('api-key')}
      value={apikey || ''}
      onChange={(value) => updateCkan({ apikey: value || undefined })}
    />
  )
}
