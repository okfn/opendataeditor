import * as React from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

const HeadingSelector = styled((props: TextFieldProps) => (
  <TextField size="small" {...props} />
))<TextFieldProps>(({ theme }) => ({
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
  '& .MuiSelect-select': {
    height: `calc(${theme.spacing(3)} - 1px) !important`,
    minHeight: 'unset !important',
    fontSize: theme.typography.h6.fontSize,
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
