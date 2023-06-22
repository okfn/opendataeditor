import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputField from '../../../../Parts/Fields/Input'
import YesNoField from '../../../../Parts/Fields/YesNo'
import { useStore } from '../../store'

export default function CkanSection() {
  return (
    <Box sx={{ paddingTop: 2 }}>
      <Typography variant="h4">Ckan</Typography>
      <Box>
        <Baseurl />
        <Dataset />
        <Apikey />
        <AllowUpdate />
      </Box>
    </Box>
  )
}

function Baseurl() {
  const updateControl = useStore((state) => state.updateControl)
  const baseurl = useStore((state) => state.ckanControl?.baseurl)
  return (
    <InputField
      required
      label="Base Url"
      value={baseurl || ''}
      onChange={(value) => updateControl({ baseurl: value })}
    />
  )
}

function Dataset() {
  const updateControl = useStore((state) => state.updateControl)
  const dataset = useStore((state) => state.ckanControl?.dataset)
  return (
    <InputField
      required
      label="Dataset"
      value={dataset || ''}
      onChange={(value) => updateControl({ dataset: value })}
    />
  )
}

function Apikey() {
  const updateControl = useStore((state) => state.updateControl)
  const apikey = useStore((state) => state.ckanControl?.apikey)
  return (
    <InputField
      required
      label="API Key"
      value={apikey || ''}
      onChange={(value) => updateControl({ apikey: value })}
    />
  )
}

function AllowUpdate() {
  const updateControl = useStore((state) => state.updateControl)
  const allowUpdate = useStore((state) => state.ckanControl?.allowUpdate)
  return (
    <YesNoField
      label="Allow Update"
      value={allowUpdate || false}
      onChange={(value) => updateControl({ allowUpdate: value })}
    />
  )
}
