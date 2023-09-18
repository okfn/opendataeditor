import * as React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload'

interface ImportButtonProps extends ButtonProps {
  onImport: (value: any) => void
}

export default function ImportButton(props: ImportButtonProps) {
  const { onImport, ...others } = props
  return (
    <label htmlFor="import-button">
      <input
        type="file"
        id="import-button"
        accept=".json, .yaml"
        style={{ display: 'none' }}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          if (ev.target.files) onImport(ev.target.files[0])
          ev.target.value = ''
        }}
      />
      <Button
        disabled={props.disabled}
        title="Import as JSON or YAML"
        variant={props.variant || 'outlined'}
        component="span"
        fullWidth
        {...others}
      >
        {<FileUploadIcon fontSize="small" sx={{ mr: 1 }} />}
        Import
      </Button>
    </label>
  )
}
