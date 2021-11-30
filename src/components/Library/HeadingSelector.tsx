import TextField, { TextFieldProps } from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

const HeadingSelector = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.common.black,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.common.black,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.common.black,
    },
  },
  '& .MuiOutlinedInput-input': {
    // TODO: use theme.spacing(3)
    height: '23px',
    minHeight: '23px',
    fontSize: '18px',
    fontWeight: '500',
    color: theme.palette.common.black,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.common.black,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.common.black,
  },
}))

export default HeadingSelector
