import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import YesNoField from '../../Library/Fields/YesNoField'
import SelectField from '../../Library/Fields/SelectField'
import * as settings from '../../../settings'
import { useStore } from '../store'

export default function Field() {
  return (
    <React.Fragment>
      <HeadingBox>Field</HeadingBox>
      <Confidence />
      <FloatNumbers />
      <Type />
      <Names />
    </React.Fragment>
  )
}

function Confidence() {
  const update = useStore((state) => state.update)
  const fieldConfidence = useStore((state) => state.descriptor.fieldConfidence)
  return (
    <InputField
      label="Confidence"
      value={fieldConfidence || settings.DEFAULT_FIELD_CONFIDENCE}
      onChange={(fieldConfidence) => update({ fieldConfidence })}
    />
  )
}

function FloatNumbers() {
  const update = useStore((state) => state.update)
  const fieldFloatNumbers = useStore((state) => state.descriptor.fieldFloatNumbers)
  return (
    <YesNoField
      label="Float Numbers"
      value={fieldFloatNumbers || false}
      onChange={(fieldFloatNumbers) => update({ fieldFloatNumbers })}
    />
  )
}

function Type() {
  const update = useStore((state) => state.update)
  const fieldType = useStore((state) => state.descriptor.fieldType)
  return (
    <SelectField
      label="Type"
      value={fieldType}
      options={Object.keys(settings.FIELDS)}
      onChange={(fieldType) => update({ fieldType })}
    />
  )
}

function Names() {
  const update = useStore((state) => state.update)
  const fieldNames = useStore((state) => state.descriptor.fieldNames)
  return (
    <InputField
      label="Names"
      value={(fieldNames || []).join(',')}
      onChange={(fieldNames) => update({ fieldNames: fieldNames.split(',') })}
    />
  )
}
