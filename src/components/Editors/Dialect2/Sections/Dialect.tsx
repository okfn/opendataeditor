import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/InputField'
import YesNoField from '../../../Parts/Fields/YesNoField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import * as settings from '../../../../settings'
import { useStore } from '../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Dialect" onHeadingClick={() => updateHelp('dialect')}>
      <Columns spacing={2}>
        <Box>
          <Header />
          <HeaderRows />
        </Box>
        <Box>
          <HeaderJoin />
          <HeaderCase />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Header() {
  const header = useStore((state) => state.dialect.header)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDialect = useStore((state) => state.updateDialect)
  return (
    <YesNoField
      label="Header"
      value={header || settings.DEFAULT_HEADER}
      onFocus={() => updateHelp('dialect/header')}
      onChange={(header) => updateDialect({ header })}
    />
  )
}

function HeaderRows() {
  const headerRows = useStore((state) => state.dialect.headerRows)
  const updateDialect = useStore((state) => state.updateDialect)
  return (
    <InputField
      label="Header Rows"
      value={headerRows}
      onChange={(headerRows) => updateDialect({ headerRows })}
    />
  )
}

function HeaderJoin() {
  const headerJoin = useStore((state) => state.dialect.headerJoin)
  const updateDialect = useStore((state) => state.updateDialect)
  return (
    <InputField
      label="Header Join"
      value={headerJoin}
      onChange={(headerJoin) => updateDialect({ headerJoin })}
    />
  )
}

function HeaderCase() {
  const headerCase = useStore((state) => state.dialect.headerCase)
  const updateDialect = useStore((state) => state.updateDialect)
  return (
    <YesNoField
      label="Header Case"
      value={headerCase || settings.DEFAULT_HEADER_CASE}
      onChange={(headerCase) => updateDialect({ headerCase })}
    />
  )
}
