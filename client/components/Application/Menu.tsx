import InputAdornment from '@mui/material/InputAdornment'
import SelectField from '../Parts/Fields/Select'
import * as menu from '../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const name = useStore((state) => state.config?.project.name || 'current')
  return (
    <menu.MenuBar fullWidth>
      <SelectField
        disabled
        margin="none"
        value={name}
        options={[name]}
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
