import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import MultilineField from '../../Library/Fields/MultilineField'
import { useStore } from '../store'

export default function General() {
  return (
    <React.Fragment>
      <HeadingBox>General</HeadingBox>
      <Title />
      <Description />
    </React.Fragment>
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onChange={(title) => update({ title })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.description)
  const update = useStore((state) => state.update)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onChange={(description) => update({ description })}
    />
  )
}
