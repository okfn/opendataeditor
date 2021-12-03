import * as React from 'react'
import Heading from '../Library/Heading'
import InputField from '../Library/Fields/InputField'

export default function Loading() {
  // Components

  const Loading = () => (
    <React.Fragment>
      <Heading variant="h6">Loading</Heading>
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
