import * as React from 'react'
import EditorList from '../../../Parts/Editor/EditorList'
import EditorListItem from '../../../Parts/Editor/EditorListItem'
import EditorSearch from '../../../Parts/Editor/EditorSearch'
import { useStore, selectors } from '../store'

export default function Resource() {
  const isGrid = useStore((state) => state.resourceState.isGrid)
  const query = useStore((state) => state.resourceState.query)
  const resourceItems = useStore(selectors.resourceItems)
  const updatePackageState = useStore((state) => state.updatePackageState)
  const updateResourceState = useStore((state) => state.updateResourceState)
  const addResource = useStore((state) => state.addResource)
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
            updatePackageState({ tabIndex: 1 })
          }}
          title="View Resource"
        />
      ))}
    </EditorList>
  )
}
