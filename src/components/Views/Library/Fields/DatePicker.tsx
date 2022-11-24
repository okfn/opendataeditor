import * as React from 'react'
import { Dayjs } from 'dayjs'
import 'dayjs/locale/en'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'

interface DatePickerProps {
  label: string
  onChange: (value: any) => void
}
const DatePicker: React.FC<DatePickerProps> = ({ label, onChange }) => {
  const [value, setValue] = React.useState<Dayjs | null>(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'en'}>
      <MuiDatePicker
        label={label}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          onChange(newValue)
        }}
        renderInput={(params) => (
          <TextField {...params} margin="normal" size="small" fullWidth />
        )}
      />
    </LocalizationProvider>
  )
}
export default DatePicker
