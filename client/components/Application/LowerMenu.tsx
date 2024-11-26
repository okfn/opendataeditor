import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import reportIssueIcon from '../../assets/report_issue_icon.svg'
import userGuideIcon from '../../assets/user_guide_icon.svg'
import { useTranslation } from 'react-i18next'

export default function LowerMenu() {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderTop: '1px solid #E6E7EB',
        padding: '20px',
        bottom: 0,
      }}
    >
      <Button
        href="https://opendataeditor.okfn.org/documentation/getting-started/"
        target="_blank"
        color="OKFNCoolGray"
        sx={{ textTransform: 'none' }}
        startIcon={<img src={userGuideIcon} alt="" />}
      >
        {t('user-guide')}
      </Button>
      <Button
        href="https://github.com/okfn/opendataeditor"
        target="_blank"
        color="OKFNCoolGray"
        sx={{ textTransform: 'none' }}
        startIcon={<img src={reportIssueIcon} alt="" />}
      >
        {t('report-an-issue')}
      </Button>
    </Box>
  )
}
