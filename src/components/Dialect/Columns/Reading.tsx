import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import YesNoField from '../../Library/Fields/YesNoField'
import * as settings from '../../../settings'
import { useStore } from '../store'

export default function Reading() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)

  // Components

  const Reading = () => (
    <React.Fragment>
      <HeadingBox>Reading</HeadingBox>
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
      onChange={(header) => update({ header })}
    />
  )

  const HeaderRows = () => (
    <InputField
      label="Header Rows"
      value={descriptor.headerRows}
      onChange={(headerRows) => update({ headerRows })}
    />
  )

  const HeaderJoin = () => (
    <InputField
      label="Header Join"
      value={descriptor.headerJoin}
      onChange={(headerJoin) => update({ headerJoin })}
    />
  )

  const HeaderCase = () => (
    <YesNoField
      label="Header Case"
      value={descriptor.headerCase || settings.DEFAULT_HEADER_CASE}
      onChange={(headerCase) => update({ headerCase })}
    />
  )

  return <Reading />
}
