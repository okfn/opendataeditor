import Box from '@mui/material/Box'
import Columns from '../../../Parts/Grids/Columns'
import InputField from '../../../Parts/Fields/Input'
import EditorItem from '../../Base/Item'
import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import { useStore, selectors, select } from '../store'
import { useTranslation } from 'react-i18next'
import EditorHelp from '../../Base/Help'
import NothingToSee from '@client/components/Parts/Cards/NothingToSee'

export default function Contributors() {
  const index = useStore((state) => state.contributorState.index)
  return index === undefined ? <ContributorList /> : <ContributorItem />
}

function ContributorList() {
  const query = useStore((state) => state.contributorState.query)
  const contributorItems = useStore(selectors.contributorItems)
  const updateContributorState = useStore((state) => state.updateContributorState)
  const addContributor = useStore((state) => state.addContributor)
  const removeContributor = useStore((state) => state.removeContributor)
  const helpItem = useStore((state) => state.helpItem)
  const { t } = useTranslation()

  return (
    <EditorList
      kind="contributor"
      query={query}
      onAddClick={contributorItems.length > 0 ? addContributor : null}
    >
      <EditorHelp helpItem={helpItem} withIcon />
      {contributorItems.length > 0 ? (
        contributorItems.map(({ index, contributor }) => (
          <EditorListItem
            key={index}
            kind="contributor"
            name={contributor.title}
            type="contributor"
            onClick={() => {
              updateContributorState({ index })
            }}
            onRemoveClick={() => removeContributor(index)}
          />
        ))
      ) : (
        <NothingToSee buttonText={t('add-contributor')} onAddClick={addContributor} />
      )}
    </EditorList>
  )
}

function ContributorItem() {
  const title = useStore(
    select(selectors.contributor, (contributor) => contributor.title)
  )
  const isExtras = useStore((state) => state.contributorState.isExtras)
  const updateContributorState = useStore((state) => state.updateContributorState)
  const updateHelp = useStore((state) => state.updateHelp)

  return (
    <EditorItem
      kind="contributor"
      name={title}
      isExtras={isExtras}
      onExtrasClick={() => updateContributorState({ isExtras: !isExtras })}
      onBackClick={() => {
        updateContributorState({ index: undefined, isExtras: false })
        updateHelp('resource/contributors')
      }}
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
  const { t } = useTranslation()
  return (
    <InputField
      label={t('title')}
      value={title || ''}
      onFocus={() => updateHelp('resource/contributors/title')}
      onChange={(value) => updateContributor({ title: value })}
    />
  )
}

function Email() {
  const email = useStore(
    select(selectors.contributor, (contributor) => contributor.email)
  )
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('email')}
      value={email || ''}
      onFocus={() => updateHelp('resource/contributors/email')}
      onChange={(value) => updateContributor({ email: value || undefined })}
    />
  )
}

function Path() {
  const path = useStore(select(selectors.contributor, (contributor) => contributor.path))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('path')}
      value={path || ''}
      onFocus={() => updateHelp('resource/contributors/path')}
      onChange={(value) => updateContributor({ path: value || undefined })}
    />
  )
}

function Role() {
  const role = useStore(select(selectors.contributor, (contributor) => contributor.role))
  const updateHelp = useStore((state) => state.updateHelp)
  const updateContributor = useStore((state) => state.updateContributor)
  const { t } = useTranslation()
  return (
    <InputField
      label={t('role')}
      value={role || ''}
      onFocus={() => updateHelp('resource/contributors/role')}
      onChange={(value) => updateContributor({ role: value || undefined })}
    />
  )
}
