import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const HeadingButton = styled(Button)(({ theme }) => ({
  margin: 0,
  height: theme.spacing(5),
  textTransform: 'inherit',
  fontSize: theme.typography.h6.fontSize,
  fontWeight: 500,
  textAlign: 'left',
  justifyContent: 'flex-start',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
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
