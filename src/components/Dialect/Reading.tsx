import * as React from 'react'
import Heading from '../Library/Heading'
import InputField from '../Library/Fields/InputField'
import YesNoField from '../Library/Fields/YesNoField'
import * as settings from '../../settings'
import { useStore } from './store'

export default function Reading() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)

  // Components

  const Reading = () => (
    <React.Fragment>
      <Heading variant="h6">Reading</Heading>
      <Header />
      <HeaderRows />
      <HeaderJoin />
      <HeaderCase />
    </React.Fragment>
  )

  const Header = () => (
    <YesNoField
      label="Header"
      value={descriptor.header || settings.DEFAULT_HEADER}
      handleChange={(header) => update({ header })}
    />
  )

  const HeaderRows = () => (
    <InputField
      label="Header Rows"
      value={descriptor.headerRows}
      handleChange={(headerRows) => update({ headerRows })}
    />
  )

  const HeaderJoin = () => (
    <InputField
      label="Header Join"
      value={descriptor.headerJoin}
      handleChange={(headerJoin) => update({ headerJoin })}
    />
  )

  const HeaderCase = () => (
    <YesNoField
      label="Header Case"
      value={descriptor.headerCase || settings.DEFAULT_HEADER_CASE}
      handleChange={(headerCase) => update({ headerCase })}
    />
  )

  return <Reading />
}
