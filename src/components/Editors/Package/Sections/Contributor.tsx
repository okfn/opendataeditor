import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/InputField'
import EditorItem from '../../../Parts/Editor/EditorItem'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import EditorSearch from '../../../Parts/Editor/EditorSearch'
import { useStore, selectors, select } from '../store'

export default function Contributor() {
  const index = useStore((state) => state.contributorState.index)
  return index === undefined ? <ContributorList /> : <ContributorItem />
}

function ContributorList() {
  const isGrid = useStore((state) => state.contributorState.isGrid)
  const query = useStore((state) => state.contributorState.query)
  const contributorItems = useStore(selectors.contributorItems)
  const updateContributorState = useStore((state) => state.updateContributorState)
  const addContributor = useStore((state) => state.addContributor)
  const removeContributor = useStore((state) => state.removeContributor)
  return (
    <EditorList
      kind="contributor"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addContributor()}
      onGridClick={() => updateContributorState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateContributorState({ query })}
        />
      }
    >
      {contributorItems.map(({ index, contributor }) => (
        <EditorListItem
          key={index}
          index={index}
          kind="contributor"
          name={contributor.title}
          type="contributor"
          isGrid={isGrid}
          onClick={() => updateContributorState({ index })}
          onRemoveClick={() => removeContributor(index)}
        />
      ))}
    </EditorList>
  )
}

function ContributorItem() {
  const title = useStore(
    select(selectors.contributor, (contributor) => contributor.title)
  )
  const isExtras = useStore((state) => state.contributorState.isExtras)
  const updateContributorState = useStore((state) => state.updateContributorState)
  return (
    <EditorItem
      kind="contributor"
      name={title}
      isExtras={isExtras}
      onExtrasClick={() => updateContributorState({ isExtras: !isExtras })}
      onBackClick={() => updateContributorState({ index: undefined, isExtras: false })}
    >
      <Columns spacing={3}>
        <Box>
          <Title />
          <Email />
        </Box>
        <Box>
          <Path />
          <Role />
        </Box>
      </Columns>
    </EditorItem>
  )
}

function Title() {
  const title = useStore(
    select(selectors.contributor, (contributor) => contributor.title)
  )
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  return (
    <InputField
      label="Title"
      value={title || ''}
      onFocus={() => updateHelp('contributors/title')}
      onChange={(title) => updateContributor({ title })}
    />
  )
}

function Email() {
  const email = useStore(
    select(selectors.contributor, (contributor) => contributor.email)
  )
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  return (
    <InputField
      label="Email"
      value={email || ''}
      onFocus={() => updateHelp('contributors/email')}
      onChange={(value) => updateContributor({ email: value })}
    />
  )
}

function Path() {
  const path = useStore(select(selectors.contributor, (contributor) => contributor.path))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  return (
    <InputField
      label="Path"
      value={path || ''}
      onFocus={() => updateHelp('contributors/path')}
      onChange={(path) => updateContributor({ path })}
    />
  )
}

function Role() {
  const role = useStore(select(selectors.contributor, (contributor) => contributor.role))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  return (
    <InputField
      label="Role"
      value={role || ''}
      onFocus={() => updateHelp('contributors/role')}
      onChange={(role) => updateContributor({ role })}
    />
  )
}
