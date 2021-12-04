import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'

export default function Loading() {
  // Components

  const Loading = () => (
    <React.Fragment>
      <HeadingBox>Loading</HeadingBox>
      <Code />
    </React.Fragment>
  )

  const Code = () => (
    <React.Fragment>
      <InputField disabled label="Code" value="local" />
    </React.Fragment>
  )

  return <Loading />
}
