import * as React from 'react'
import { Dayjs } from 'dayjs'
import 'dayjs/locale/en'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { noop } from 'lodash'

interface DatePickerProps {
  label: string
  name?: string
  onChange: (value: any) => void
  onFocus?: (event: any) => void
}
const DatePicker: React.FC<DatePickerProps> = (props: DatePickerProps) => {
  const [value, setValue] = React.useState<Dayjs | null>(null)
  const onFocus = props.onFocus || noop
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en'}>
      <MuiDatePicker
        label={props.label}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          props.onChange(newValue)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            name={props.name || props.label}
            margin="normal"
            size="small"
            onFocus={onFocus}
            fullWidth
          />
        )}
      />
    </LocalizationProvider>
  )
}
export default DatePicker
