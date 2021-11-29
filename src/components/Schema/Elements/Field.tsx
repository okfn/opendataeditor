import * as React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import YesNoField from '../../Library/YesNoField'
import ValuesField from '../../Library/ValuesField'
import DescriptorField from '../../Library/DescriptorField'
import * as settings from '../settings'
import { useStore } from '../store'

export default function Field() {
  const elementIndex = useStore((state) => state.elementIndex) as number
  const updateField = useStore((state) => state.updateField)
  const field = useStore((state) => state.descriptor.fields[elementIndex])
  // @ts-ignore
  const FIELD = settings.FIELDS[field.type]

  // Compose

  const ArrayItem = () => (
    <DescriptorField
      type="yaml"
      label="Array Item"
      value={field.arrayItem}
      handleChange={(arrayItem) => updateField({ arrayItem })}
    />
  )

  const TrueValues = () => (
    <ValuesField
      type="true"
      values={field.trueValues || []}
      options={settings.TRUE_VALUES}
      handleChange={(trueValues) => updateField({ trueValues })}
    />
  )

  const FalseValues = () => (
    <ValuesField
      type="false"
      values={field.falseValues || []}
      options={settings.FALSE_VALUES}
      handleChange={(falseValues) => updateField({ falseValues })}
    />
  )

  const BareNumber = () => (
    <YesNoField
      label="Bare Number"
      value={field.bareNumber || settings.DEFAULT_BARE_NUMBER}
      handleChange={(bareNumber) => updateField({ bareNumber })}
    />
  )

  const FloatNumber = () => (
    <YesNoField
      label="Float Number"
      value={field.floatNumber || false}
      handleChange={(floatNumber) => updateField({ floatNumber })}
    />
  )

  const DecimalChar = () => (
    <TextField
      fullWidth
      label="Decimal Char"
      margin="normal"
      value={field.decimalChar || settings.DEFAULT_DECIMAL_CHAR}
      onChange={(ev) => updateField({ decimalChar: ev.target.value })}
    />
  )

  const GroupChar = () => (
    <TextField
      fullWidth
      label="Group Char"
      margin="normal"
      value={field.groupChar || settings.DEFAULT_GROUP_CHAR}
      onChange={(ev) => updateField({ groupChar: ev.target.value })}
    />
  )

  const ExtraProperties = () => {
    switch (field.type) {
      case 'array':
        return <ArrayItem />
      case 'boolean':
        return (
          <React.Fragment>
            <TrueValues />
            <FalseValues />
          </React.Fragment>
        )
      case 'integer':
        return (
          <React.Fragment>
            <BareNumber />
            <GroupChar />
          </React.Fragment>
        )
      case 'number':
        return (
          <React.Fragment>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <BareNumber />
              </Grid>
              <Grid item xs={6}>
                <GroupChar />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FloatNumber />
              </Grid>
              <Grid item xs={6}>
                <DecimalChar />
              </Grid>
            </Grid>
          </React.Fragment>
        )
      default:
        return null
    }
  }

  // Render

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={field.name}
          onChange={(ev) => updateField({ name: ev.target.value })}
        />
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Type"
              margin="normal"
              value={field.type}
              onChange={(ev) => updateField({ type: ev.target.value })}
            >
              {Object.keys(settings.FIELDS).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            {FIELD.formats.includes('*') ? (
              <TextField
                fullWidth
                label="Format"
                margin="normal"
                value={field.format}
                onChange={(ev) => updateField({ format: ev.target.value })}
              />
            ) : (
              <TextField
                select
                fullWidth
                label="Format"
                margin="normal"
                value={field.format}
                disabled={FIELD.formats.length < 2}
                onChange={(ev) => updateField({ format: ev.target.value })}
              >
                {FIELD.formats.map((format: string) => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Grid>
        </Grid>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={field.title || ''}
          onChange={(ev) => updateField({ title: ev.target.value })}
        />
        <TextField
          fullWidth
          label="Description"
          margin="normal"
          value={field.description || ''}
          onChange={(ev) => updateField({ description: ev.target.value })}
          multiline
        />
      </Grid>
      <Grid item xs={6}>
        <ValuesField
          type="missing"
          values={field.missingValues || []}
          options={settings.MISSING_VALUES}
          handleChange={(missingValues) => updateField({ missingValues })}
        />
        <TextField
          fullWidth
          label="RDF Type"
          margin="normal"
          value={field.rdfType || ''}
          onChange={(ev) => updateField({ rdfType: ev.target.value })}
        />
        <ExtraProperties />
      </Grid>
    </Grid>
  )
}
