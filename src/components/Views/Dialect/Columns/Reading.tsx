import * as React from 'react'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import YesNoField from '../../Library/Fields/YesNoField'
import * as settings from '../../../../settings'
import { useStore } from '../store'

export default function Reading() {
  return (
    <React.Fragment>
      <HeadingBox>Reading</HeadingBox>
      <Header />
      <HeaderRows />
      <HeaderJoin />
      <HeaderCase />
    </React.Fragment>
  )
}

function Header() {
  const header = useStore((state) => state.descriptor.header)
  const update = useStore((state) => state.update)
  return (
    <YesNoField
      label="Header"
      value={header || settings.DEFAULT_HEADER}
      onChange={(header) => update({ header })}
    />
  )
}

function HeaderRows() {
  const headerRows = useStore((state) => state.descriptor.headerRows)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Header Rows"
      value={headerRows}
      onChange={(headerRows) => update({ headerRows })}
    />
  )
}

function HeaderJoin() {
  const headerJoin = useStore((state) => state.descriptor.headerJoin)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Header Join"
      value={headerJoin}
      onChange={(headerJoin) => update({ headerJoin })}
    />
  )
}

function HeaderCase() {
  const headerCase = useStore((state) => state.descriptor.headerCase)
  const update = useStore((state) => state.update)
  return (
    <YesNoField
      label="Header Case"
      value={headerCase || settings.DEFAULT_HEADER_CASE}
      onChange={(headerCase) => update({ headerCase })}
    />
  )
}
