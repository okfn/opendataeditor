import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/Input'
import EditorItem from '../../../Parts/Editor/EditorItem'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import EditorSearch from '../../../Parts/Editor/EditorSearch'
import { useStore, selectors, select } from '../store'
import { useTheme } from '@mui/material/styles'
import ScrollBox from '../../../Parts/ScrollBox'
import validator from 'validator'

export default function Source() {
  const index = useStore((state) => state.sourceState.index)
  return index === undefined ? <SourceList /> : <SourceItem />
}

function SourceList() {
  const theme = useTheme()
  const isGrid = useStore((state) => state.sourceState.isGrid)
  const query = useStore((state) => state.sourceState.query)
  const sourceItems = useStore(selectors.sourceItems)
  const updateSourceState = useStore((state) => state.updateSourceState)
  const addSource = useStore((state) => state.addSource)
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 15)})`
  return (
    <EditorList
      kind="source"
      query={query}
      isGrid={isGrid}
      count={sourceItems.length}
      onAddClick={() => addSource()}
      onGridClick={() => updateSourceState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateSourceState({ query })}
        />
      }
    >
      {sourceItems.length === 0 ? (
        <ScrollBox height={contentHeight}>
          <SourceListItem />
        </ScrollBox>
      ) : (
        <SourceListItem />
      )}
    </EditorList>
  )
}

function SourceListItem() {
  const sourceItems = useStore(selectors.sourceItems)
  const isGrid = useStore((state) => state.contributorState.isGrid)
  const updateSourceState = useStore((state) => state.updateSourceState)
  const removeSource = useStore((state) => state.removeSource)
  return (
    <React.Fragment>
      {sourceItems.map(({ index, source }) => (
        <EditorListItem
          key={index}
          kind="source"
          name={source.title}
          type="source"
          isGrid={isGrid}
          onClick={() => {
            updateSourceState({ index })
          }}
          onRemoveClick={() => removeSource(index)}
        />
      ))}
    </React.Fragment>
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
  return (
    <InputField
      label="Title"
      value={title}
      onFocus={() => updateHelp('sources/title')}
      onChange={(title) => updateSource({ title })}
    />
  )
}

function Path() {
  const path = useStore(select(selectors.source, (source) => source.path))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateSource = useStore((state) => state.updateSource)
  return (
    <InputField
      label="Path"
      value={path || ''}
      onFocus={() => updateHelp('sources/path')}
      onChange={(path) => updateSource({ path })}
    />
  )
}

function Email() {
  const email = useStore(select(selectors.source, (source) => source.email))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateSource = useStore((state) => state.updateSource)
  const [isValid, setIsValid] = React.useState(isValidEmail())
  function isValidEmail() {
    return email ? validator.isEmail(email) : true
  }
  return (
    <InputField
      error={!isValid}
      label="Email"
      value={email || ''}
      onFocus={() => updateHelp('sources/email')}
      onBlur={() => {
        setIsValid(isValidEmail())
      }}
      onChange={(value) => updateSource({ email: value || undefined })}
      helperText={!isValid ? 'Email is not valid.' : ''}
    />
  )
}
