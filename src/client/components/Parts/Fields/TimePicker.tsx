import * as React from 'react'
import { Dayjs } from 'dayjs'
import 'dayjs/locale/en'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers/TimePicker'
import noop from 'lodash/noop'

interface TimePickerProps {
  label: string
  value?: Dayjs | null
  name?: string
  errorMessage?: string
  onChange: (value: any) => void
  onFocus?: (event: any) => void
}
const TimePicker: React.FC<TimePickerProps> = (props: TimePickerProps) => {
  const [value, setValue] = React.useState<Dayjs | null>(props.value ?? null)
  const [isValid, setIsValid] = React.useState(isValidTime())
  const onFocus = props.onFocus || noop
  function isValidTime() {
    return value ? value.isValid() : true
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en'}>
      <MuiTimePicker
        label={props.label}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          props.onChange(newValue)
        }}
        slots={{
          textField: (params) => (
            <TextField
              {...params}
              error={!isValid}
              name={props.name || props.label}
              margin="normal"
              size="small"
              onFocus={onFocus}
              onBlur={() => {
                setIsValid(isValidTime())
              }}
              fullWidth
              helperText={!isValid ? props?.errorMessage : undefined}
            />
          ),
        }}
      />
    </LocalizationProvider>
  )
}
export default TimePicker
