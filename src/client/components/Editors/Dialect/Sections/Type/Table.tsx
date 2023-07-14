import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import InputField from '../../../../Parts/Fields/Input'
import EditorSection from '../../../Base/Section'
import * as settings from '../../../../../settings'
import { useStore } from '../../store'
import YesNoField from '../../../../Parts/Fields/YesNo'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection name="Table" onHeadingClick={() => updateHelp('dialect/type')}>
      <Columns spacing={3}>
        <Box>
          <Header />
          <HeaderRows />
          <HeaderJoin />
          <HeaderCase />
        </Box>
        <Box>
          <CommentChar />
          <CommentRows />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function CommentChar() {
  const commentChar = useStore((state) => state.descriptor.commentChar)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Comment Char"
      value={commentChar || settings.DEFAULT_COMMENT_CHAR}
      onFocus={() => updateHelp('dialect/commentChar')}
      onChange={(value) => updateDescriptor({ commentChar: value || undefined })}
    />
  )
}

function CommentRows() {
  const commentRows = useStore((state) => state.descriptor.commentRows)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Comment Rows"
      value={(commentRows || []).join(',')}
      onFocus={() => updateHelp('dialect/commentRows')}
      onChange={(value) =>
        updateDescriptor({
          commentRows: value ? value.split(',').map(parseInt) : undefined,
        })
      }
    />
  )
}

function Header() {
  const header = useStore((state) => state.descriptor.header)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <YesNoField
      label="Header"
      value={header ?? settings.DEFAULT_HEADER}
      onFocus={() => updateHelp('dialect/header')}
      onChange={(value) => updateDescriptor({ header: value || undefined })}
    />
  )
}

function HeaderRows() {
  const headerRows = useStore((state) => state.descriptor.headerRows)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Header Rows"
      value={headerRows}
      onFocus={() => updateHelp('dialect/headerRows')}
      onChange={(headerRows) =>
        updateDescriptor({
          headerRows: headerRows ? headerRows.split(',').map(parseInt) : undefined,
        })
      }
    />
  )
}

function HeaderJoin() {
  const headerJoin = useStore((state) => state.descriptor.headerJoin)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <InputField
      label="Header Join"
      value={headerJoin}
      onFocus={() => updateHelp('dialect/headerJoin')}
      onChange={(value) => updateDescriptor({ headerJoin: value || undefined })}
    />
  )
}

function HeaderCase() {
  const headerCase = useStore((state) => state.descriptor.headerCase)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <YesNoField
      label="Header Case"
      value={headerCase ?? settings.DEFAULT_HEADER_CASE}
      onFocus={() => updateHelp('dialect/headerCase')}
      onChange={(value) => updateDescriptor({ headerCase: value || undefined })}
    />
  )
}
