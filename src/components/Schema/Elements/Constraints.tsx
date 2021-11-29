import * as React from 'react'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import YesNoField from '../../Library/YesNoField'
import * as settings from '../../../settings'
import { useStore } from '../store'

export default function Constraints() {
  const elementIndex = useStore((state) => state.elementIndex) as number
  const updateField = useStore((state) => state.updateField)
  const field = useStore((state) => state.descriptor.fields[elementIndex])
  const constraints = field.constraints || {}
  // @ts-ignore
  const FIELD = settings.FIELDS[field.type]

  // Compose

  const Required = () => (
    <YesNoField
      label="Required"
      value={constraints.required || false}
      handleChange={(required) =>
        updateField({ constraints: { ...constraints, required } })
      }
    />
  )

  const Minimum = () => (
    <TextField
      fullWidth
      type="number"
      label="Minimum"
      margin="normal"
      value={constraints.minimum}
      onChange={(ev) =>
        updateField({ constraints: { ...constraints, minimum: ev.target.value } })
      }
    />
  )

  const Maximum = () => (
    <TextField
      fullWidth
      type="number"
      label="Maximum"
      margin="normal"
      value={constraints.maximum}
      onChange={(ev) =>
        updateField({ constraints: { ...constraints, maximum: ev.target.value } })
      }
    />
  )

  const MinLength = () => (
    <TextField
      fullWidth
      type="number"
      label="Min Length"
      margin="normal"
      value={constraints.minLength}
      onChange={(ev) =>
        updateField({ constraints: { ...constraints, minLength: ev.target.value } })
      }
    />
  )

  const MaxLength = () => (
    <TextField
      fullWidth
      type="number"
      label="Max Length"
      margin="normal"
      value={constraints.maxLength}
      onChange={(ev) =>
        updateField({ constraints: { ...constraints, maxLength: ev.target.value } })
      }
    />
  )

  const Pattern = () => (
    <TextField
      fullWidth
      label="Pattern"
      margin="normal"
      value={constraints.pattern}
      onChange={(ev) =>
        updateField({ constraints: { ...constraints, pattern: ev.target.value } })
      }
    />
  )

  // TODO: fix editing
  const Enum = () => (
    <TextField
      fullWidth
      label="Enum"
      margin="normal"
      value={(constraints.enum || []).join(',')}
      onChange={(ev) =>
        updateField({ constraints: { ...constraints, enum: ev.target.value.split(',') } })
      }
    />
  )

  const Constraint = (props: { type: string }) => {
    switch (props.type) {
      case 'required':
        return <Required />
      case 'minLength':
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <MinLength />
            </Grid>
            <Grid item xs={6}>
              <MaxLength />
            </Grid>
          </Grid>
        )
      case 'minimum':
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Minimum />
            </Grid>
            <Grid item xs={6}>
              <Maximum />
            </Grid>
          </Grid>
        )
      case 'pattern':
        return <Pattern />
      case 'enum':
        return <Enum />
      default:
        return null
    }
  }

  // Render

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
