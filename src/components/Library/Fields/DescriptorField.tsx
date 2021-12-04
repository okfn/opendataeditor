import * as React from 'react'
import yaml from 'js-yaml'
import isPlainObject from 'lodash/isPlainObject'
import TextField from '@mui/material/TextField'

interface DescriptorFieldProps {
  type: 'yaml' | 'json'
  label: string
  value?: string
  size?: 'small' | 'medium'
  onChange: (value: boolean) => void
}

export default function DescriptorField(props: DescriptorFieldProps) {
  const encode = props.type === 'yaml' ? yaml.dump : JSON.stringify
  const decode = props.type === 'yaml' ? yaml.load : JSON.parse
  return (
    <TextField
      fullWidth
      multiline
      margin="normal"
      label={props.label}
      size={props.size || 'medium'}
      defaultValue={props.value ? encode(props.value).trim() : null}
      onBlur={(ev) => {
        ev.preventDefault()
        try {
          const value = decode(ev.target.value)
          if (isPlainObject(value)) props.onChange(value)
        } catch (error) {}
      }}
    />
  )
}
