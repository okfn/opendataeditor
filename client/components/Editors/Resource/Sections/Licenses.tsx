import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Grids/Columns'
import InputField from '../../../Parts/Fields/Input'
import EditorItem from '../../Base/Item'
import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useStore, selectors, select } from '../store'
import validator from 'validator'

export default function Licenses() {
  const index = useStore((state) => state.licenseState.index)
  return index === undefined ? <LicenseList /> : <LicenseItem />
}

function LicenseList() {
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const query = useStore((state) => state.licenseState.query)
  const licenseItems = useStore(selectors.licenseItems)
  const updateLicenseState = useStore((state) => state.updateLicenseState)
  const removeLicense = useStore((state) => state.removeLicense)

  return (
    <>
      <EditorList kind="license" query={query} onAddClick={() => setDialogOpen(true)}>
        {licenseItems.map(({ index, license }) => (
          <EditorListItem
            key={index}
            kind="license"
            name={license.name}
            type="license"
            onClick={() => updateLicenseState({ index })}
            onRemoveClick={() => removeLicense(index)}
          />
        ))}
      </EditorList>
      <LicenseDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}

function LicenseDialog(props: { open: boolean; onClose: () => void }) {
  const addLicense = useStore((state) => state.addLicense)

  const licenses = [
    { name: 'ODC-By-1.0', title: 'Open Data Commons Attribution License' },
    { name: 'ODbL-1.0', title: 'Open Data Commons Open Database License' },
    { name: 'PDDL-1.0', title: 'Open Data Commons Public Domain Dedication and Licence' },
    { name: 'Custom', title: 'I will add a license manually' },
  ]

  const handleSelect = (event: SelectChangeEvent) => {
    props.onClose()
  }

  return (
    <Box>
      <Dialog disableEscapeKeyDown open={props.open} onClose={props.onClose}>
        <DialogTitle>Select the license</DialogTitle>
        <DialogContent>
          <Box component="form">
            <FormControl sx={{ my: 1, minWidth: '30em' }}>
              <InputLabel id="license-dialog-select-label-id">License</InputLabel>
              <Select
                value=""
                labelId="demo-simple-select-label"
                id="license-dialog-select-id"
                label="License"
                onChange={handleSelect}
              >
                {licenses.map((license) => (
                  <MenuItem key={license.name} value={license.name}>
                    {license.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

function LicenseItem() {
  const name = useStore(select(selectors.license, (license) => license.name))
  const isExtras = useStore((state) => state.licenseState.isExtras)
  const updateLicenseState = useStore((state) => state.updateLicenseState)
  return (
    <EditorItem
      kind="license"
      name={name}
      isExtras={isExtras}
      onExtrasClick={() => updateLicenseState({ isExtras: !isExtras })}
      onBackClick={() => updateLicenseState({ index: undefined, isExtras: false })}
    >
      <Columns spacing={3}>
        <Box>
          <Name />
          <Title />
        </Box>
        <Box>
          <Path />
        </Box>
      </Columns>
    </EditorItem>
  )
}

function Name() {
  const name = useStore(select(selectors.license, (license) => license.name))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateLicense = useStore((state) => state.updateLicense)
  const [isValid, setIsValid] = React.useState(isValidName())
  function isValidName() {
    return name ? validator.isSlug(name) : false
  }
  return (
    <InputField
      label="Name"
      value={name}
      onFocus={() => updateHelp('resource/licenses/name')}
      onBlur={() => {
        setIsValid(isValidName())
      }}
      onChange={(value) => updateLicense({ name: value || 'name' })}
      helperText={!isValid ? 'Name is not valid.' : ''}
    />
  )
}

function Title() {
  const title = useStore(select(selectors.license, (license) => license.title))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateLicense = useStore((state) => state.updateLicense)
  const [isValid, setIsValid] = React.useState(isValidTitle())
  function isValidTitle() {
    return title ? !validator.isNumeric(title) : true
  }
  return (
    <InputField
      error={!isValid}
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('resource/licenses/title')}
      onBlur={() => {
        setIsValid(isValidTitle())
      }}
      onChange={(value) => updateLicense({ title: value || undefined })}
    />
  )
}

function Path() {
  const path = useStore(select(selectors.license, (license) => license.path))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateLicense = useStore((state) => state.updateLicense)
  return (
    <InputField
      label="Path"
      value={path || ''}
      onFocus={() => updateHelp('resource/licenses/path')}
      onChange={(value) => updateLicense({ path: value || undefined })}
    />
  )
}
