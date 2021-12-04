import * as React from 'react'
import Button from '@mui/material/Button'

// TODO: generalize not only for descriptors?

interface ImportButtonProps {
  onImport: (value: any) => void
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
        variant="outlined"
        component="span"
        color="info"
        fullWidth
      >
        Import
      </Button>
    </label>
  )
}
