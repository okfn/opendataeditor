import * as React from 'react'
import { Dayjs } from 'dayjs'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

interface BasicDatePickerProps {
  label: string
  onChange: (value: any) => void
}
const BasicDatePicker: React.FC<BasicDatePickerProps> = ({ label, onChange }) => {
  const [value, setValue] = React.useState<Dayjs | null>(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
          const newValueString = newValue?.toString()
          onChange(newValueString)
        }}
        renderInput={(params) => <TextField {...params} margin="normal" size="small" />}
      />
    </LocalizationProvider>
  )
}
export default BasicDatePicker
