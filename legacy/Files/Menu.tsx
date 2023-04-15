import * as React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import SelectField from '../../Parts/Fields/Select'
import MenuBar from '../../Parts/Bars/Menu'

export default function Menu() {
  return (
    <MenuBar>
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
    </MenuBar>
  )
}
