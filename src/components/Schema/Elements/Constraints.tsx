import * as React from 'react'
import Grid from '@mui/material/Grid'
import YesNoField from '../../Library/YesNoField'
import InputField from '../../Library/InputField'
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
    <InputField
      type="number"
      label="Minimum"
      value={constraints.minimum}
      handleChange={(minimum) =>
        updateField({ constraints: { ...constraints, minimum } })
      }
    />
  )

  const Maximum = () => (
    <InputField
      type="number"
      label="Maximum"
      value={constraints.maximum}
      handleChange={(maximum) =>
        updateField({ constraints: { ...constraints, maximum } })
      }
    />
  )

  const MinLength = () => (
    <InputField
      type="number"
      label="Min Length"
      value={constraints.minLength}
      handleChange={(minLength) =>
        updateField({ constraints: { ...constraints, minLength } })
      }
    />
  )

  const MaxLength = () => (
    <InputField
      type="number"
      label="Max Length"
      value={constraints.maxLength}
      handleChange={(maxLength) =>
        updateField({ constraints: { ...constraints, maxLength } })
      }
    />
  )

  const Pattern = () => (
    <InputField
      type="string"
      label="Pattern"
      value={constraints.pattern}
      handleChange={(pattern) =>
        updateField({ constraints: { ...constraints, pattern } })
      }
    />
  )

  // TODO: fix editing
  const Enum = () => (
    <InputField
      type="string"
      label="Enum"
      value={(constraints.enum || []).join(',')}
      handleChange={(value) =>
        updateField({ constraints: { ...constraints, enum: value } })
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
