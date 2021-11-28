import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

const HeadingSelector = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'black',
    },
    '&:hover fieldset': {
      borderColor: 'black',
    },
    '&:hover legend': {
      color: 'black',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused legend': {
      color: 'black',
    },
  },
  '& .MuiOutlinedInput-input': {
    // TODO: use theme.spacing(3)
    height: '23px',
    minHeight: '23px',
    fontSize: '18px',
    fontWeight: '500',
    color: 'black',
  },
  '& .MuiSelect-icon': {
    color: 'black',
  },
}))

export default HeadingSelector
