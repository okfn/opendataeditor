import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const HeadingButton = styled(Button)(({ theme }) => ({
  margin: 0,
  height: '100%',
  textTransform: 'inherit',
  fontSize: '18px',
  fontWeight: 500,
  textAlign: 'left',
  justifyContent: 'flex-start',
  // textDecoration: 'underline !important',
  borderColor: theme.palette.common.black,
  color: theme.palette.common.black,
  marginTop: '-3px',
  '&:hover': {
    borderColor: theme.palette.common.black,
    backgroundColor: theme.palette.grey[50],
  },
}))

export default HeadingButton
