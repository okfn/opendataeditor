import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import { useStore } from '../store'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

export default function GithubSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection onHeadingClick={() => updateHelp('github')}>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        {' '}
        <User />
        <Repo />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Email />
        <Apikey />{' '}
      </Box>
    </EditorSection>
  )
}

function User() {
  const user = useStore((state) => state.descriptor.github?.user)
  const updateGithub = useStore((state) => state.updateGithub)
  const { t } = useTranslation()
  return (
    <InputField
      required
      label={t('user')}
      value={user || ''}
      onChange={(value) => updateGithub({ user: value || undefined })}
    />
  )
}

function Repo() {
  const repo = useStore((state) => state.descriptor.github?.repo)
  const updateGithub = useStore((state) => state.updateGithub)
  const { t } = useTranslation()
  return (
    <InputField
      required
      label={t('repo')}
      value={repo || ''}
      onChange={(value) => updateGithub({ repo: value || undefined })}
    />
  )
}

function Email() {
  const email = useStore((state) => state.descriptor.github?.email)
  const updateGithub = useStore((state) => state.updateGithub)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('email')}
      value={email || ''}
      onChange={(value) => updateGithub({ email: value || undefined })}
    />
  )
}

function Apikey() {
  const apikey = useStore((state) => state.descriptor.github?.apikey)
  const updateGithub = useStore((state) => state.updateGithub)
  const { t } = useTranslation()
  return (
    <InputField
      required
      type="password"
      label={t('api-key')}
      value={apikey || ''}
      onChange={(value) => updateGithub({ apikey: value || undefined })}
    />
  )
}
