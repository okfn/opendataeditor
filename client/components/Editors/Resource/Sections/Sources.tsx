import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Grids/Columns'
import InputField from '../../../Parts/Fields/Input'
import EditorItem from '../../Base/Item'
import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import { useStore, selectors, select } from '../store'
import validator from 'validator'
import { useTranslation } from 'react-i18next'
import EditorHelp from '../../Base/Help'
import NothingToSee from '@client/components/Parts/Cards/NothingToSee'

export default function Sources() {
  const index = useStore((state) => state.sourceState.index)
  return index === undefined ? <SourceList /> : <SourceItem />
}

function SourceList() {
  const query = useStore((state) => state.sourceState.query)
  const sourceItems = useStore(selectors.sourceItems)
  const updateSourceState = useStore((state) => state.updateSourceState)
  const addSource = useStore((state) => state.addSource)
  const removeSource = useStore((state) => state.removeSource)
  const helpItem = useStore((state) => state.helpItem)
  const { t } = useTranslation()

  return (
    <EditorList
      kind="source"
      query={query}
      onAddClick={sourceItems.length > 0 ? addSource : null}
    >
      <EditorHelp helpItem={helpItem} withIcon />
      {sourceItems.length > 0 ? (
        sourceItems.map(({ index, source }) => (
          <EditorListItem
            key={index}
            kind="source"
            name={source.title}
            type="source"
            onClick={() => {
              updateSourceState({ index })
            }}
            onRemoveClick={() => removeSource(index)}
          />
        ))
      ) : (
        <NothingToSee buttonText={t('add-source')} onAddClick={addSource} />
      )}
    </EditorList>
  )
}

function SourceItem() {
  const title = useStore(select(selectors.source, (source) => source.title))
  const isExtras = useStore((state) => state.sourceState.isExtras)
  const updateSourceState = useStore((state) => state.updateSourceState)
  return (
    <EditorItem
      kind="source"
      name={title}
      isExtras={isExtras}
      onExtrasClick={() => updateSourceState({ isExtras: !isExtras })}
      onBackClick={() => updateSourceState({ index: undefined, isExtras: false })}
    >
      <Columns spacing={3}>
        <Box>
          <Title />
          <Email />
        </Box>
        <Box>
          <Path />
        </Box>
      </Columns>
    </EditorItem>
  )
}

function Title() {
  const title = useStore(select(selectors.source, (source) => source.title))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateSource = useStore((state) => state.updateSource)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('title')}
      value={title}
      onFocus={() => updateHelp('resource/sources/title')}
      onChange={(title) => updateSource({ title })}
    />
  )
}

function Path() {
  const path = useStore(select(selectors.source, (source) => source.path))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateSource = useStore((state) => state.updateSource)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('path')}
      value={path || ''}
      onFocus={() => updateHelp('resource/sources/path')}
      onChange={(value) => updateSource({ path: value || undefined })}
    />
  )
}

function Email() {
  const email = useStore(select(selectors.source, (source) => source.email))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateSource = useStore((state) => state.updateSource)
  const [isValid, setIsValid] = React.useState(isValidEmail())
  const { t } = useTranslation()
  function isValidEmail() {
    return email ? validator.isEmail(email) : true
  }
  return (
    <InputField
      error={!isValid}
      label={t('email')}
      value={email || ''}
      onFocus={() => updateHelp('resource/sources/email')}
      onBlur={() => {
        setIsValid(isValidEmail())
      }}
      onChange={(value) => updateSource({ email: value || undefined })}
      helperText={!isValid ? t('email-not-valid') : ''}
    />
  )
}
