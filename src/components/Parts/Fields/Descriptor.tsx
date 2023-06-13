import * as React from 'react'
import yaml from 'js-yaml'
import noop from 'lodash/noop'
import isPlainObject from 'lodash/isPlainObject'
import TextField from '@mui/material/TextField'
import * as types from '../../../types'

interface DescriptorFieldProps {
  type: 'json' | 'yaml'
  label: string
  value?: types.IDict
  size?: 'small' | 'medium'
  onChange: (value: types.IDict) => void
  onFocus?: () => void
}

export default function DescriptorField(props: DescriptorFieldProps) {
  const encode = props.type === 'yaml' ? yaml.dump : JSON.stringify
  const decode = props.type === 'yaml' ? yaml.load : JSON.parse
  const onFocus = props.onFocus || noop
  return (
    <TextField
      fullWidth
      multiline
      margin="normal"
      label={props.label}
      size={props.size || 'small'}
      defaultValue={props.value ? encode(props.value).trim() : null}
      onFocus={onFocus}
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
