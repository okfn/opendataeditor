import * as store from '@client/store'
import { languages } from '@locale/index'
import TranslateIcon from '@mui/icons-material/Translate'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import sidebarLogo from '../../assets/ODE_sidebar_logo.svg'
import reportIssueIcon from '../../assets/report_issue_icon.svg'
import userGuideIcon from '../../assets/user_guide_icon.svg'
import Browser from './Browser'

export default function Sidebar() {
  return (
    <Stack
      id="sidebar"
      sx={{
        height: '100vh',
        borderRight: 'solid 1px #ddd',
      }}
    >
      <SidebarLogo />
      <SidebarControls />
      <Browser />
      <SidebarMenu />
    </Stack>
  )
}

export function SidebarLogo() {
  return (
    <Box sx={{ padding: '24px' }}>
      <img src={sidebarLogo} alt="" />
    </Box>
  )
}

export function SidebarControls() {
  const { t } = useTranslation()

  return (
    <Button
      variant="outlined"
      sx={{
        textTransform: 'none',
        mb: '22px',
        mx: '24px',
        '&:hover': {
          color: 'white',
          borderColor: (theme) => theme.palette.OKFNBlue.main,
          backgroundColor: (theme) => theme.palette.OKFNBlue.main,
        },
      }}
      onClick={() => store.openDialog('fileUpload')}
    >
      {t('upload-your-data')}
    </Button>
  )
}

function SidebarMenu() {
  return (
    <Stack
      spacing={0}
      useFlexGap
      sx={{
        alignItems: 'flex-start',
        borderTop: '1px solid #E6E7EB',
        padding: '20px',
      }}
    >
      <UserGuideLink />
      <ReportIssueLink />
      <LanguageSelect />
    </Stack>
  )
}

function UserGuideLink() {
  const { t } = useTranslation()

  return (
    <Button
      href="https://opendataeditor.okfn.org/documentation/getting-started/"
      target="_blank"
      color="OKFNCoolGray"
      sx={{ textTransform: 'none' }}
      startIcon={<img src={userGuideIcon} alt="" />}
    >
      {t('user-guide')}
    </Button>
  )
}

function ReportIssueLink() {
  const { t } = useTranslation()

  return (
    <Button
      href="https://github.com/okfn/opendataeditor"
      target="_blank"
      color="OKFNCoolGray"
      sx={{ textTransform: 'none' }}
      startIcon={<img src={reportIssueIcon} alt="" />}
    >
      {t('report-issue')}
    </Button>
  )
}

function LanguageSelect() {
  const { t, i18n } = useTranslation()

  const handleChange = (code: string) => {
    // @ts-ignore
    const bridge = window?.opendataeditor

    i18next.changeLanguage(code)
    bridge?.changeLanguage(code)
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        marginTop: 1,
        color: 'OKFNCoolGray.main',
        alignItems: 'center',
      }}
    >
      <TranslateIcon sx={{ fontSize: '20px', marginLeft: '4px' }} />
      <FormControl size="small">
        <InputLabel id="language-select-label">{t('language')}</InputLabel>
        <Select
          label={t('language')}
          labelId="language-select-label"
          value={i18n.language}
          onChange={(event) => handleChange(event.target.value as string)}
        >
          {languages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              {language.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}
