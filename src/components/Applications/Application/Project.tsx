import * as React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import SelectField from '../../Parts/Fields/Select'
import * as menu from '../../Parts/Bars/Menu'

export default function Project() {
  return (
    <menu.MenuBar fullWidth>
      <SelectField
        disabled
        margin="none"
        value="current"
        options={['current']}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" disableTypography>
              Project:
            </InputAdornment>
          ),
        }}
      />
    </menu.MenuBar>
  )
}
