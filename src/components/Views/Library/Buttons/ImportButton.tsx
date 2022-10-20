import * as React from 'react'
import Button from '@mui/material/Button'
import * as settings from '../../../../settings'

// TODO: generalize not only for descriptors?

interface ImportButtonProps {
  onImport: (value: any) => void
  variant?: 'contained' | 'outlined' | 'text'
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
        title="Import as JSON or YAML"
        variant={props.variant || settings.DEFUALT_BUTTON_VARIANT}
        component="span"
        color="info"
        fullWidth
      >
        Import
      </Button>
    </label>
  )
}
