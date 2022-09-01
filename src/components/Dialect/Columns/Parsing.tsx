import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Library/Columns'
import HeadingBox from '../../Library/Groups/HeadingBox'
import InputField from '../../Library/Fields/InputField'
import YesNoField from '../../Library/Fields/YesNoField'
import * as settings from '../../../settings'
import { useStore } from '../store'

export default function Parsing() {
  return (
    <React.Fragment>
      <HeadingBox>Parsing</HeadingBox>
      <Columns spacing={3}>
        <Box>
          <CommentChar />
          <Delimiter />
          <QuoteChar />
          <DoubleQuote />
        </Box>
        <Box>
          <LineTerminator />
          <EscapeChar />
          <NullSequence />
          <SkipInitialSpace />
        </Box>
      </Columns>
    </React.Fragment>
  )
}

function CommentChar() {
  const commentChar = useStore((state) => state.descriptor.commentChar)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Comment Char"
      value={commentChar || settings.DEFAULT_COMMENT_CHAR}
      onChange={(commentChar) => update({ commentChar })}
    />
  )
}

function Delimiter() {
  const delimiter = useStore((state) => state.descriptor.csv?.delimiter)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Delimiter"
      value={delimiter || settings.DEFAULT_DELIMITER}
      onChange={(delimiter) => updateCsv({ delimiter })}
    />
  )
}

function LineTerminator() {
  // const lineTerminator = useStore((state) => state.descriptor.lineTerminator)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      disabled
      label="Line Terminator"
      value={settings.DEFAULT_LINE_TERMINATOR}
      onChange={(lineTerminator) => updateCsv({ lineTerminator })}
    />
  )
}

function QuoteChar() {
  const quoteChar = useStore((state) => state.descriptor.csv?.quoteChar)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Quote Char"
      value={quoteChar || settings.DEFAULT_QUOTE_CHAR}
      onChange={(quoteChar) => updateCsv({ quoteChar })}
    />
  )
}

function DoubleQuote() {
  const doubleQuote = useStore((state) => state.descriptor.csv?.doubleQuote)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <YesNoField
      label="Double Quote"
      value={doubleQuote || settings.DEFAULT_DOUBLE_QUOTE}
      onChange={(doubleQuote) => updateCsv({ doubleQuote })}
    />
  )
}

function EscapeChar() {
  const escapeChar = useStore((state) => state.descriptor.csv?.escapeChar)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Escape Char"
      value={escapeChar || settings.DEFAULT_ESCAPE_CHAR}
      onChange={(escapeChar) => updateCsv({ escapeChar })}
    />
  )
}

function NullSequence() {
  const nullSequence = useStore((state) => state.descriptor.csv?.nullSequence)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <InputField
      label="Null Sequence"
      value={nullSequence || settings.DEFAULT_NULL_SEQUENCE}
      onChange={(nullSequence) => updateCsv({ nullSequence })}
    />
  )
}

function SkipInitialSpace() {
  const skipInitialSpace = useStore((state) => state.descriptor.csv?.skipInitialSpace)
  const updateCsv = useStore((state) => state.updateCsv)
  return (
    <YesNoField
      label="Skip Initial Space"
      value={skipInitialSpace || settings.DEFAULT_SKIP_INITIAL_SPACE}
      onChange={(skipInitialSpace) => updateCsv({ skipInitialSpace })}
    />
  )
}
