import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'

export default function Loading() {
  return (
    <React.Fragment>
      <HeadingBox>Loading</HeadingBox>
      <Code />
    </React.Fragment>
  )
}

function Code() {
  return <InputField disabled label="Code" value="local" />
}
