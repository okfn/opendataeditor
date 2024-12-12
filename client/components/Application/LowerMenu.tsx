import TranslateIcon from '@mui/icons-material/Translate'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import reportIssueIcon from '../../assets/report_issue_icon.svg'
import userGuideIcon from '../../assets/user_guide_icon.svg'

export default function LowerMenu() {
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
  return (
    <Button
      href="https://opendataeditor.okfn.org/documentation/getting-started/"
      target="_blank"
      color="OKFNCoolGray"
      sx={{ textTransform: 'none' }}
      startIcon={<img src={userGuideIcon} alt="" />}
    >
      User guide
    </Button>
  )
}

function ReportIssueLink() {
  return (
    <Button
      href="https://github.com/okfn/opendataeditor"
      target="_blank"
      color="OKFNCoolGray"
      sx={{ textTransform: 'none' }}
      startIcon={<img src={reportIssueIcon} alt="" />}
    >
      Report an issue
    </Button>
  )
}

function LanguageSelect() {
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
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          label="Language"
          labelId="language-select-label"
          value={'en'}
          onChange={console.log}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="spanish">Spanish</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}
