import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../../Parts/Fields/Input'
import MultilineField from '../../../Parts/Fields/Multiline'
import SelectField from '../../../Parts/Fields/Select'
import EditorSection from '../../Base/Section'
import YesNoField from '../../../Parts/Fields/YesNo'
import Columns from '../../../Parts/Grids/Columns'
import { useStore } from '../store'
import validator from 'validator'
import * as settings from '../../../../settings'

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
          <Format />
          <Columns spacing={1}>
            <Header />
            <HeaderCase />
          </Columns>
          <HeaderRows />
          <HeaderJoin />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Title() {
  const title = useStore((state) => state.descriptor.title)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  const [isValid, setIsValid] = React.useState(isValidTitle())
  function isValidTitle() {
    return title ? !validator.isNumeric(title) : true
  }
  return (
    <InputField
      error={!isValid}
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('dialect/title')}
      onBlur={() => {
        setIsValid(isValidTitle())
      }}
      onChange={(value) => updateDescriptor({ title: value || undefined })}
      helperText={!isValid ? 'Title is not valid.' : ''}
    />
  )
}

function Description() {
  const description = useStore((state) => state.descriptor.description)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateDescriptor = useStore((state) => state.updateDescriptor)
  return (
    <MultilineField
      label="Description"
      value={description || ''}
      onFocus={() => updateHelp('dialect/description')}
      onChange={(value) => updateDescriptor({ description: value || undefined })}
    />
  )
}

function Format() {
  const format = useStore((state) => state.format)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const externalMenu = useStore((state) => state.externalMenu)
  return (
    <SelectField
      label="Format"
      value={format || ''}
      disabled={!!externalMenu}
      options={['csv', 'excel', 'json']}
      onFocus={() => updateHelp('dialect/format')}
      onChange={(value) => updateState({ format: value || 'table' })}
    />
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
      onFocus={() => updateHelp('dialect/type/commentChar')}
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
      onFocus={() => updateHelp('dialect/type/commentRows')}
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
      onFocus={() => updateHelp('dialect/type/header')}
      onChange={(value) => updateDescriptor({ header: value ?? undefined })}
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
      value={(headerRows || []).join(',')}
      onFocus={() => updateHelp('dialect/type/headerRows')}
      onChange={(value) =>
        updateDescriptor({
          headerRows: value ? value.split(',').map(parseInt) : undefined,
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
      onFocus={() => updateHelp('dialect/type/headerJoin')}
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
      onFocus={() => updateHelp('dialect/type/headerCase')}
      onChange={(value) => updateDescriptor({ headerCase: value ?? undefined })}
    />
  )
}
