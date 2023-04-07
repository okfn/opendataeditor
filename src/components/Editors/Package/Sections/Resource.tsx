import * as React from 'react'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import EditorSearch from '../../../Parts/Editor/EditorSearch'
import { useStore, selectors } from '../store'
import { useTheme } from '@mui/material/styles'
import ScrollBox from '../../../Parts/ScrollBox'

export default function Resource() {
  const theme = useTheme()
  const isGrid = useStore((state) => state.resourceState.isGrid)
  const query = useStore((state) => state.resourceState.query)
  const resourceItems = useStore(selectors.resourceItems)
  const updateState = useStore((state) => state.updateState)
  const updateResourceState = useStore((state) => state.updateResourceState)
  const addResource = useStore((state) => state.addResource)
  const removeResource = useStore((state) => state.removeResource)
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 15)})`
  return (
    <EditorList
      kind="resource"
      query={query}
      isGrid={isGrid}
      onAddClick={() => addResource()}
      onGridClick={() => updateResourceState({ isGrid: !isGrid })}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateResourceState({ query })}
        />
      }
    >
      <ScrollBox height={contentHeight}>
        {resourceItems.map(({ index, resource }) => (
          <EditorListItem
            key={index}
            index={index}
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
      </ScrollBox>
    </EditorList>
  )
}
