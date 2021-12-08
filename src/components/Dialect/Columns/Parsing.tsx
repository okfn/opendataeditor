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
          <Delimiter />
          <QuoteChar />
          <DoubleQuote />
          <SkipInitialSpace />
        </Box>
        <Box>
          <LineTerminator />
          <EscapeChar />
          <CommentChar />
          <NullSequence />
        </Box>
      </Columns>
    </React.Fragment>
  )
}

function Delimiter() {
  const delimiter = useStore((state) => state.descriptor.delimiter)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Delimiter"
      value={delimiter || settings.DEFAULT_DELIMITER}
      onChange={(delimiter) => update({ delimiter })}
    />
  )
}

function LineTerminator() {
  // const lineTerminator = useStore((state) => state.descriptor.lineTerminator)
  const update = useStore((state) => state.update)
  return (
    <InputField
      disabled
      label="Line Terminator"
      value={settings.DEFAULT_LINE_TERMINATOR}
      onChange={(lineTerminator) => update({ lineTerminator })}
    />
  )
}

function QuoteChar() {
  const quoteChar = useStore((state) => state.descriptor.quoteChar)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Quote Char"
      value={quoteChar || settings.DEFAULT_QUOTE_CHAR}
      onChange={(quoteChar) => update({ quoteChar })}
    />
  )
}

function DoubleQuote() {
  const doubleQuote = useStore((state) => state.descriptor.doubleQuote)
  const update = useStore((state) => state.update)
  return (
    <YesNoField
      label="Double Quote"
      value={doubleQuote || settings.DEFAULT_DOUBLE_QUOTE}
      onChange={(doubleQuote) => update({ doubleQuote })}
    />
  )
}

function EscapeChar() {
  const escapeChar = useStore((state) => state.descriptor.escapeChar)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Escape Char"
      value={escapeChar || settings.DEFAULT_ESCAPE_CHAR}
      onChange={(escapeChar) => update({ escapeChar })}
    />
  )
}

function NullSequence() {
  const nullSequence = useStore((state) => state.descriptor.nullSequence)
  const update = useStore((state) => state.update)
  return (
    <InputField
      label="Null Sequence"
      value={nullSequence || settings.DEFAULT_NULL_SEQUENCE}
      onChange={(nullSequence) => update({ nullSequence })}
    />
  )
}

function SkipInitialSpace() {
  const skipInitialSpace = useStore((state) => state.descriptor.skipInitialSpace)
  const update = useStore((state) => state.update)
  return (
    <YesNoField
      label="Skip Initial Space"
      value={skipInitialSpace || settings.DEFAULT_SKIP_INITIAL_SPACE}
      onChange={(skipInitialSpace) => update({ skipInitialSpace })}
    />
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
