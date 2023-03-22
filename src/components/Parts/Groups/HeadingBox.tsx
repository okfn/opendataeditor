import * as React from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// TODO: rebase on Box
// TODO: include also variant/etc

const Heading = styled((props: TypographyProps) => (
  <Typography variant="h4" {...props} />
))(({ theme }) => ({
  lineHeight: theme.spacing(5),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}))

export default Heading
