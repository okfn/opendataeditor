import * as React from 'react'
import { Dayjs } from 'dayjs'
import 'dayjs/locale/en'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import * as settings from '../../../settings'
import noop from 'lodash/noop'

interface DatePickerProps {
  label: string
  name?: string
  value?: Dayjs | null
  inputFormat?: string
  errorMessage?: string
  onChange: (value: any) => void
  onFocus?: (event: any) => void
}
const DatePicker: React.FC<DatePickerProps> = (props: DatePickerProps) => {
  const [value, setValue] = React.useState<Dayjs | null>(props.value ?? null)
  const [isValid, setIsValid] = React.useState(isValidDate())
  const onFocus = props.onFocus || noop
  function isValidDate() {
    return value ? value.isValid() : true
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en'}>
      <MuiDatePicker
        label={props.label}
        value={value}
        format={props.inputFormat || settings.DEFUALT_DATETIME_FORMAT}
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
                setIsValid(isValidDate())
              }}
              fullWidth
              helperText={value && !value.isValid() ? props?.errorMessage : undefined}
            />
          ),
        }}
      />
    </LocalizationProvider>
  )
}
export default DatePicker
