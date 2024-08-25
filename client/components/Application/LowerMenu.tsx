import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import reportIssueIcon from '../../assets/report_issue_icon.svg'
import userGuideIcon from '../../assets/user_guide_icon.svg'

export default function LowerMenu() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderTop: '1px solid #E6E7EB',
        padding: '20px',
        position: 'absolute',
        bottom: 0,
        width: '100%',
      }}
    >
      <Button
        href="https://opendataeditor.okfn.org/documentation/getting-started/"
        target="_blank"
        color="OKFNCoolGray"
        sx={{ textTransform: 'none' }}
        startIcon={<img src={userGuideIcon} alt="" />}
      >
        User guide
      </Button>
      <Button
        href="https://github.com/okfn/opendataeditor"
        target="_blank"
        color="OKFNCoolGray"
        sx={{ textTransform: 'none' }}
        startIcon={<img src={reportIssueIcon} alt="" />}
      >
        Report an issue
      </Button>
    </Box>
  )
}
