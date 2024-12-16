import EditorSection from '../../Base/Section'
import MultilineField from '../../../Parts/Fields/Multiline'
import InputField from '../../../Parts/Fields/Input'
import { useStore } from '../store'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

export default function ZenodoSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection onHeadingClick={() => updateHelp('zenodo')}>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        {' '}
        <Title />
        <Description />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Author />
        <Apikey />
      </Box>
    </EditorSection>
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.zenodo?.title)
  const updateZenodo = useStore((state) => state.updateZenodo)
  const { t } = useTranslation()
  return (
    <InputField
      required
      label={t('title')}
      value={title || ''}
      onChange={(value) => updateZenodo({ title: value || undefined })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.zenodo?.description)
  const updateZenodo = useStore((state) => state.updateZenodo)
  const { t } = useTranslation()
  return (
    <MultilineField
      required
      label={t('description')}
      value={description || ''}
      onChange={(value) => updateZenodo({ description: value || undefined })}
      width="350px"
    />
  )
}

function Author() {
  const author = useStore((state) => state.descriptor.zenodo?.author)
  const updateZenodo = useStore((state) => state.updateZenodo)
  const { t } = useTranslation()
  return (
    <InputField
      required
      label={t('author')}
      value={author || ''}
      onChange={(value) => updateZenodo({ author: value || undefined })}
    />
  )
}

function Apikey() {
  const apikey = useStore((state) => state.descriptor.zenodo?.apikey)
  const updateZenodo = useStore((state) => state.updateZenodo)
  const { t } = useTranslation()
  return (
    <InputField
      required
      type="password"
      label={t('api-key')}
      value={apikey || ''}
      onChange={(value) => updateZenodo({ apikey: value || undefined })}
    />
  )
}
