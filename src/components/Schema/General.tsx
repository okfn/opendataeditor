import * as React from 'react'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { useStore } from './store'

export default function General() {
  const page = useStore((state) => state.page)
  const descriptor = useStore((state) => state.descriptor)
  const setPage = useStore((state) => state.setPage)
  const update = useStore((state) => state.update)
  // TODO: allow free input instead of predefined list
  const MISSING_VALUES = ['""', 'n/a', 'na', 'N/A', 'NA']
  const encodeMissingValue = (value: string) => (value === '' ? '""' : value)
  const decodeMissingValue = (value: string) => (value === '""' ? '' : value)
  return (
    <FormControl fullWidth>
      <Typography variant="h6">General</Typography>
      <TextField
        select
        label="Missing Values"
        margin="normal"
        value={descriptor.missingValues.map(encodeMissingValue) || []}
        onChange={(ev) =>
          // @ts-ignore
          update({ missingValues: ev.target.value.map(decodeMissingValue) })
        }
        SelectProps={{ multiple: true }}
      >
        {MISSING_VALUES.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Primary Key"
        margin="normal"
        value={descriptor.primaryKey || []}
        onChange={(ev) => update({ primaryKey: ev.target.value })}
        SelectProps={{ multiple: true }}
      >
        {descriptor.fields.map((field) => (
          <MenuItem key={field.name} value={field.name}>
            {field.name}
          </MenuItem>
        ))}
      </TextField>
      <Switch
        fullWidth
        size="large"
        color="info"
        variant="outlined"
        endIcon={page === 'foreignKeys' ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
        onClick={() => setPage('foreignKeys')}
      >
        Foreign Keys
      </Switch>
      <Switch
        fullWidth
        size="large"
        color="info"
        variant="outlined"
        endIcon={page === 'fields' ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
        onClick={() => setPage('fields')}
      >
        Fields
      </Switch>
    </FormControl>
  )
}

const Switch = styled(Button)(({ theme }) => ({
  '&:hover': {
    borderColor: '#333',
    backgroundColor: 'white',
  },
  color: '#777',
  borderColor: '#ccc',
  justifyContent: 'space-between',
  textTransform: 'initial',
  padding: [theme.spacing(2), theme.spacing(2)],
  marginTop: theme.spacing(2),
}))
