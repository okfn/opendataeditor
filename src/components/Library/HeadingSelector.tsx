import TextField, { TextFieldProps } from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

const HeadingSelector = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.info.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.info.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.info.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    // TODO: use theme.spacing(3)
    height: '23px',
    minHeight: '23px',
    fontSize: '18px',
    fontWeight: '500',
    color: theme.palette.info.main,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.info.main,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.info.main,
  },
}))

export default HeadingSelector
