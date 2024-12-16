import Box from '@mui/material/Box'
import Columns from '../../../../Parts/Grids/Columns'
import InputField from '../../../../Parts/Fields/Input'
import YesNoField from '../../../../Parts/Fields/YesNo'
import EditorSection from '../../../Base/Section'
import * as settings from '../../../../../settings'
import { useStore, selectors, select } from '../../store'
import { useTranslation } from 'react-i18next'
import EditorHelp from '../../../Base/Help'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  const helpItem = useStore((state) => state.helpItem)
  return (
    <EditorSection name="Csv" onHeadingClick={() => updateHelp('dialect/format')}>
      <EditorHelp helpItem={helpItem} withIcon />
      <Columns spacing={3}>
        <Box>
          <Delimiter />
          <QuoteChar />
          <DoubleQuote />
          <LineTerminator />
        </Box>
        <Box>
          <EscapeChar />
          <NullSequence />
          <SkipInitialSpace />
        </Box>
      </Columns>
    </EditorSection>
  )
}

function Delimiter() {
  const delimiter = useStore(select(selectors.csv, (csv) => csv.delimiter))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('delimiter')}
      value={delimiter || settings.DEFAULT_DELIMITER}
      onFocus={() => updateHelp('dialect/format/delimiter')}
      onChange={(delimiter) => updateCsv({ delimiter })}
    />
  )
}

function LineTerminator() {
  const lineTerminator = useStore(select(selectors.csv, (csv) => csv.lineTerminator))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('line-terminator')}
      value={lineTerminator || settings.DEFAULT_LINE_TERMINATOR}
      onFocus={() => updateHelp('dialect/format/lineTerminator')}
      onChange={(lineTerminator) => updateCsv({ lineTerminator })}
    />
  )
}

function QuoteChar() {
  const quoteChar = useStore(select(selectors.csv, (csv) => csv.quoteChar))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('quote-char')}
      value={quoteChar || settings.DEFAULT_QUOTE_CHAR}
      onFocus={() => updateHelp('dialect/format/quoteChar')}
      onChange={(quoteChar) => updateCsv({ quoteChar })}
    />
  )
}

function DoubleQuote() {
  const doubleQuote = useStore(select(selectors.csv, (csv) => csv.doubleQuote))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  const { t } = useTranslation()
  return (
    <YesNoField
      label={t('double-quote')}
      value={doubleQuote ?? settings.DEFAULT_DOUBLE_QUOTE}
      onFocus={() => updateHelp('dialect/format/doubleQuote')}
      onChange={(doubleQuote) => updateCsv({ doubleQuote })}
    />
  )
}

function EscapeChar() {
  const escapeChar = useStore(select(selectors.csv, (csv) => csv.escapeChar))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('escape-char')}
      value={escapeChar || settings.DEFAULT_ESCAPE_CHAR}
      onFocus={() => updateHelp('dialect/format/escapeChar')}
      onChange={(escapeChar) => updateCsv({ escapeChar })}
    />
  )
}

function NullSequence() {
  const nullSequence = useStore(select(selectors.csv, (csv) => csv.nullSequence))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('null-sequence')}
      value={nullSequence || settings.DEFAULT_NULL_SEQUENCE}
      onFocus={() => updateHelp('dialect/format/nullSequence')}
      onChange={(nullSequence) => updateCsv({ nullSequence })}
    />
  )
}

function SkipInitialSpace() {
  const skipInitialSpace = useStore(select(selectors.csv, (csv) => csv.skipInitialSpace))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateCsv = useStore((state) => state.updateCsv)
  const { t } = useTranslation()
  return (
    <YesNoField
      label={t('skip-initial-space')}
      value={skipInitialSpace || settings.DEFAULT_SKIP_INITIAL_SPACE}
      onFocus={() => updateHelp('dialect/format/skipInitialSpace')}
      onChange={(skipInitialSpace) => updateCsv({ skipInitialSpace })}
    />
  )
}
