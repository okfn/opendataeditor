import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/InputField'
import YesNoField from '../../../Parts/Fields/YesNoField'
import MultilineField from '../../../Parts/Fields/MultilineField'
import EditorSection from '../../../Parts/Editor/EditorSection'
import Columns from '../../../Parts/Columns'
import * as settings from '../../../../settings'
import { useStore } from '../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Dialect" onHeadingClick={() => updateHelp('dialect')}>
      <Columns spacing={3}>
        <Box>
          <Title />
          <Description />
          <CommentChar />
          <CommentRows />
        </Box>
        <Box>
          <Header />
          <HeaderRows />
          <HeaderJoin />
          <HeaderCase />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Title() {
  const title = useStore((state) => state.dialect.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDialect = useStore((state) => state.updateDialect)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('dialect/title')}
      onChange={(value) => updateDialect({ title: value || undefined })}
    />
  )
}

function Description() {
  const description = useStore((state) => state.dialect.description)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDialect = useStore((state) => state.updateDialect)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onFocus={() => updateHelp('dialect/description')}
      onChange={(value) => updateDialect({ description: value || undefined })}
    />
  )
}

function CommentChar() {
  const commentChar = useStore((state) => state.dialect.commentChar)
  const updateDialect = useStore((state) => state.updateDialect)
  return (
    <InputField
      label="Comment Char"
      value={commentChar || settings.DEFAULT_COMMENT_CHAR}
      onChange={(commentChar) => updateDialect({ commentChar })}
    />
  )
}

function CommentRows() {
  const commentRows = useStore((state) => state.dialect.commentRows)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDialect = useStore((state) => state.updateDialect)
  return (
    <InputField
      label="Comment Rows"
      value={(commentRows || []).join(',')}
      onFocus={() => updateHelp('schema/commentRows')}
      onChange={(value) =>
        updateDialect({ commentRows: value ? value.split(',') : undefined })
      }
    />
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
