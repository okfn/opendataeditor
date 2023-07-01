import * as React from 'react'
import { Dayjs } from 'dayjs'
import 'dayjs/locale/en'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import noop from 'lodash/noop'

interface DateTimePickerProps {
  label: string
  value?: Dayjs | null
  name?: string
  errorMessage?: string
  onChange: (value: any) => void
  onFocus?: (event: any) => void
}
const DateTimePicker: React.FC<DateTimePickerProps> = (props: DateTimePickerProps) => {
  const [value, setValue] = React.useState<Dayjs | null>(props.value ?? null)
  const [isValid, setIsValid] = React.useState(isValidDateTime())
  const onFocus = props.onFocus || noop
  function isValidDateTime() {
    return value ? value.isValid() : true
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en'}>
      <MuiDateTimePicker
        label={props.label}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          props.onChange(newValue)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!isValid}
            name={props.name || props.label}
            margin="normal"
            size="small"
            onFocus={onFocus}
            onBlur={() => {
              setIsValid(isValidDateTime())
            }}
            fullWidth
            helperText={!isValid ? props?.errorMessage : undefined}
          />
        )}
      />
    </LocalizationProvider>
  )
}
export default DateTimePicker
