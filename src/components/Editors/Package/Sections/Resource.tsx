import * as React from 'react'
import EditorList from '../../../Parts/Editor/List'
import EditorListItem from '../../../Parts/Editor/ListItem'
import EditorSearch from '../../../Parts/Editor/Search'
import { useStore, selectors } from '../store'
import { useTheme } from '@mui/material/styles'
import ScrollBox from '../../../Parts/ScrollBox'

export default function Resource() {
  const theme = useTheme()
  const isGrid = useStore((state) => state.resourceState.isGrid)
  const query = useStore((state) => state.resourceState.query)
  const resourceItems = useStore(selectors.resourceItems)
  const updateResourceState = useStore((state) => state.updateResourceState)
  const addResource = useStore((state) => state.addResource)
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 15)})`
  return (
    <EditorList
      kind="resource"
      query={query}
      isGrid={isGrid}
      count={resourceItems.length}
      onAddClick={() => addResource()}
      onGridClick={() => updateResourceState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateResourceState({ query })}
        />
      }
    >
      {resourceItems.length === 0 ? (
        <ResourceListItem />
      ) : (
        <ScrollBox height={contentHeight}>
          <ResourceListItem />
        </ScrollBox>
      )}
    </EditorList>
  )
}

function ResourceListItem() {
  const resourceItems = useStore(selectors.resourceItems)
  const updateState = useStore((state) => state.updateState)
  const isGrid = useStore((state) => state.contributorState.isGrid)
  const updateResourceState = useStore((state) => state.updateResourceState)
  const removeResource = useStore((state) => state.removeResource)
  return (
    <React.Fragment>
      {resourceItems.map(({ index, resource }) => (
        <EditorListItem
          key={index}
          kind="resource"
          name={resource.name}
          type={resource.type}
          isGrid={isGrid}
          onClick={() => {
            updateResourceState({ index })
            updateState({ tabIndex: 1 })
          }}
          onRemoveClick={() => removeResource(index)}
        />
      ))}
    </React.Fragment>
  )
}
