import * as React from 'react'
import Grid from '@mui/material/Grid'
import Columns from '../../Library/Columns'
import InputField from '../../Library/Fields/InputField'
import YesNoField from '../../Library/Fields/YesNoField'
import * as settings from '../../../settings'
import { useStore } from '../store'

export default function Constraints() {
  const elementIndex = useStore((state) => state.elementIndex) as number
  const updateField = useStore((state) => state.updateField)
  const field = useStore((state) => state.descriptor.fields[elementIndex])
  const constraints = field.constraints || {}
  const FIELD = (settings.FIELDS as any)[field.type]

  // Components

  const Constraints = () => (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        {FIELD.constraints.map((type: string) => (
          <Constraint key={type} type={type} />
        ))}
      </Grid>
    </Grid>
  )

  const Constraint = (props: { type: string }) => {
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

  const MinLengthConstraint = () => (
    <Columns spacing={1}>
      <MinLength />
      <MaxLength />
    </Columns>
  )

  const MinimumConstraint = () => (
    <Columns spacing={1}>
      <Minimum />
      <Maximum />
    </Columns>
  )

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

  return <Constraints />
}
