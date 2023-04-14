import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/Input'
import EditorItem from '../../../Parts/Editor/EditorItem'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import EditorSearch from '../../../Parts/Editor/EditorSearch'
import { useStore, selectors, select } from '../store'
import { useTheme } from '@mui/material/styles'
import ScrollBox from '../../../Parts/ScrollBox'
import validator from 'validator'

export default function License() {
  const index = useStore((state) => state.licenseState.index)
  return index === undefined ? <LicenseList /> : <LicenseItem />
}

function LicenseList() {
  const theme = useTheme()
  const isGrid = useStore((state) => state.licenseState.isGrid)
  const query = useStore((state) => state.licenseState.query)
  const licenseItems = useStore(selectors.licenseItems)
  const updateLicenseState = useStore((state) => state.updateLicenseState)
  const addLicense = useStore((state) => state.addLicense)
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 15)})`
  return (
    <EditorList
      kind="license"
      query={query}
      isGrid={isGrid}
      count={licenseItems.length}
      onAddClick={() => addLicense()}
      onGridClick={() => updateLicenseState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateLicenseState({ query })}
        />
      }
    >
      {licenseItems.length === 0 ? (
        <LicenseListItem />
      ) : (
        <ScrollBox height={contentHeight}>
          <LicenseListItem />
        </ScrollBox>
      )}
    </EditorList>
  )
}

function LicenseListItem() {
  const licenseItems = useStore(selectors.licenseItems)
  const isGrid = useStore((state) => state.contributorState.isGrid)
  const updateLicenseState = useStore((state) => state.updateLicenseState)
  const removeLicense = useStore((state) => state.removeLicense)
  return (
    <React.Fragment>
      {licenseItems.map(({ index, license }) => (
        <EditorListItem
          key={index}
          kind="license"
          name={license.name}
          type="license"
          isGrid={isGrid}
          onClick={() => updateLicenseState({ index })}
          onRemoveClick={() => removeLicense(index)}
        />
      ))}
    </React.Fragment>
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
  return (
    <InputField
      label="Name"
      value={name}
      onFocus={() => updateHelp('licenses/name')}
      onChange={(name) => updateLicense({ name })}
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
      onFocus={() => updateHelp('licenses/title')}
      onBlur={() => {
        setIsValid(isValidTitle())
      }}
      onChange={(value) => updateLicense({ title: value || undefined })}
      helperText={!isValid ? 'Title is not valid.' : ''}
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
      onFocus={() => updateHelp('licenses/path')}
      onChange={(path) => updateLicense({ path })}
    />
  )
}
