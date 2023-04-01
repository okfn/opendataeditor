import * as React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import SelectField from '../../Parts/Fields/SelectField'
import MenuBar from '../../Parts/Bars/Menu'

export default function Menu() {
  return (
    <MenuBar>
      <SelectField
        disabled
        margin="none"
        value="default"
        options={['default']}
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
