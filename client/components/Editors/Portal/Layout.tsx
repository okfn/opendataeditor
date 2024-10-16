import Box from '@mui/material/Box'
import publishDialogImg from '../../Application/Dialogs/assets/dialog_publish.png'
import EditorHelp from '../Base/Help'
import CkanSection from './Sections/Ckan'
import GithubSection from './Sections/Github'
import ZenodoSection from './Sections/Zenodo'
import { useStore } from './store'
import DialogTabs from '../../Parts/Tabs/Dialog'

export default function Layout() {
  const tabLabels = ['Ckan', 'Github', 'Zenodo']

  const helpItem = useStore((state) => state.helpItem)
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
            <EditorHelp helpItem={helpItem} />
            <CkanSection />
          </Box>
          <Box>
            <EditorHelp helpItem={helpItem} />
            <GithubSection />
          </Box>
          <Box>
            <EditorHelp helpItem={helpItem} />
            <ZenodoSection />
          </Box>
        </DialogTabs>
      </Box>
    </Box>
  )
}
