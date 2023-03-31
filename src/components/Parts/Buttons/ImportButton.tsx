import * as React from 'react'
import Button from '@mui/material/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import * as settings from '../../../settings'

// TODO: generalize not only for descriptors?

interface ImportButtonProps {
  onImport: (value: any) => void
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
}

export default function ImportButton(props: ImportButtonProps) {
  return (
    <label htmlFor="import-button">
      <input
        type="file"
        id="import-button"
        accept=".json, .yaml"
        style={{ display: 'none' }}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          if (ev.target.files) props.onImport(ev.target.files[0])
          ev.target.value = ''
        }}
      />
      <Button
        disabled={props.disabled}
        title="Import as JSON or YAML"
        variant={props.variant || 'outlined'}
        component="span"
        color="info"
        fullWidth
      >
        {<FileUploadIcon fontSize="small" sx={{ mr: 1 }} />}
        Import
      </Button>
    </label>
  )
}
