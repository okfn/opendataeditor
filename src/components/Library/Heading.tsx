import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// TODO: include also variant/etc

const Heading = styled(Typography)(({ theme }) => ({
  lineHeight: theme.spacing(7),
  marginBottom: theme.spacing(1),
}))

export default Heading
