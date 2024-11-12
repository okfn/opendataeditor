import publishDialogImg from '@client/assets/dialog_publish.png'
import Box from '@mui/material/Box'
import DialogTabs from '../../Parts/Tabs/Dialog'
import CkanSection from './Sections/Ckan'
import GithubSection from './Sections/Github'
import ZenodoSection from './Sections/Zenodo'

export default function Layout() {
  const tabLabels = ['Ckan', 'Github', 'Zenodo']

  return (
    <Box sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '9px',
          paddingBottom: '30px',
        }}
      >
        <img src={publishDialogImg} alt="Image Publish Dialog" />
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <DialogTabs labels={tabLabels}>
          <Box>
            <CkanSection />
          </Box>
          <Box>
            <GithubSection />
          </Box>
          <Box>
            <ZenodoSection />
          </Box>
        </DialogTabs>
      </Box>
    </Box>
  )
}
