import * as React from 'react'
import Grid from '@mui/material/Grid'
import Columns from '../../Library/Columns'
import InputField from '../../Library/Fields/InputField'
import YesNoField from '../../Library/Fields/YesNoField'
import * as settings from '../../../settings'
import { useStore, selectors, select } from '../store'

// TODO: rebase on proper constraint selectors/updaters

export default function Constraints() {
  const field = useStore(selectors.field)
  // TODO: remove any
  const FIELD = (settings.FIELDS as any)[field.type]
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        {FIELD.constraints.map((type: string) => (
          <Constraint key={type} type={type} />
        ))}
      </Grid>
    </Grid>
  )
}

function Constraint(props: { type: string }) {
  switch (props.type) {
    case 'required':
      return <Required />
    case 'minLength':
      return <MinLengthConstraint />
    case 'minimum':
      return <MinimumConstraint />
    case 'pattern':
      return <Pattern />
    case 'enum':
      return <Enum />
    default:
      return null
  }
}

function MinLengthConstraint() {
  return (
    <Columns spacing={1}>
      <MinLength />
      <MaxLength />
    </Columns>
  )
}

function MinimumConstraint() {
  return (
    <Columns spacing={1}>
      <Minimum />
      <Maximum />
    </Columns>
  )
}

function Required() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (f) => f.constraints)) || {}
  return (
    <YesNoField
      label="Required"
      value={constraints.required || false}
      onChange={(required) => updateField({ constraints: { ...constraints, required } })}
    />
  )
}

function Minimum() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (f) => f.constraints)) || {}
  return (
    <InputField
      type="number"
      label="Minimum"
      value={constraints.minimum}
      onChange={(minimum) => updateField({ constraints: { ...constraints, minimum } })}
    />
  )
}

function Maximum() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (f) => f.constraints)) || {}
  return (
    <InputField
      type="number"
      label="Maximum"
      value={constraints.maximum}
      onChange={(maximum) => updateField({ constraints: { ...constraints, maximum } })}
    />
  )
}

function MinLength() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (f) => f.constraints)) || {}
  return (
    <InputField
      type="number"
      label="Min Length"
      value={constraints.minLength}
      onChange={(minLength) =>
        updateField({ constraints: { ...constraints, minLength } })
      }
    />
  )
}

function MaxLength() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (f) => f.constraints)) || {}
  return (
    <InputField
      type="number"
      label="Max Length"
      value={constraints.maxLength}
      onChange={(maxLength) =>
        updateField({ constraints: { ...constraints, maxLength } })
      }
    />
  )
}

function Pattern() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (f) => f.constraints)) || {}
  return (
    <InputField
      type="string"
      label="Pattern"
      value={constraints.pattern}
      onChange={(pattern) => updateField({ constraints: { ...constraints, pattern } })}
    />
  )
}

function Enum() {
  const updateField = useStore((state) => state.updateField)
  const constraints = useStore(select(selectors.field, (f) => f.constraints)) || {}
  return (
    <InputField
      type="string"
      label="Enum"
      value={(constraints.enum || []).join(',')}
      onChange={(value) => updateField({ constraints: { ...constraints, enum: value } })}
    />
  )
}
