import EditorSection from '../../Base/Section'
import InputField from '../../../Parts/Fields/Input'
import { useStore } from '../store'
import Box from '@mui/material/Box'

export default function GithubSection() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Github" onHeadingClick={() => updateHelp('github')}>
      <Box sx={{ display: 'flex' }}>
        {' '}
        <User />
        <Repo />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Email />
        <Apikey />{' '}
      </Box>
    </EditorSection>
  )
}

function User() {
  const user = useStore((state) => state.descriptor.github?.user)
  const updateGithub = useStore((state) => state.updateGithub)
  return (
    <InputField
      required
      label="User"
      value={user || ''}
      onChange={(value) => updateGithub({ user: value || undefined })}
    />
  )
}

function Repo() {
  const repo = useStore((state) => state.descriptor.github?.repo)
  const updateGithub = useStore((state) => state.updateGithub)
  return (
    <InputField
      required
      label="Repo"
      value={repo || ''}
      onChange={(value) => updateGithub({ repo: value || undefined })}
    />
  )
}

function Email() {
  const email = useStore((state) => state.descriptor.github?.email)
  const updateGithub = useStore((state) => state.updateGithub)
  return (
    <InputField
      label="Email"
      value={email || ''}
      onChange={(value) => updateGithub({ email: value || undefined })}
    />
  )
}

function Apikey() {
  const apikey = useStore((state) => state.descriptor.github?.apikey)
  const updateGithub = useStore((state) => state.updateGithub)
  return (
    <InputField
      required
      type="password"
      label="API Key"
      value={apikey || ''}
      onChange={(value) => updateGithub({ apikey: value || undefined })}
    />
  )
}
