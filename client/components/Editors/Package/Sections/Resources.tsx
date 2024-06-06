import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import EditorSearch from '../../Base/Search'
import { useStore, selectors } from '../store'

export default function Resources() {
  const query = useStore((state) => state.resourceState.query)
  const resourceItems = useStore(selectors.resourceItems)
  const updateResourceState = useStore((state) => state.updateResourceState)
  const addResource = useStore((state) => state.addResource)
  const removeResource = useStore((state) => state.removeResource)
  const onResourceSelected = useStore((state) => state.onResourceSelected)
  return (
    <EditorList
      kind="resource"
      query={query}
      onAddClick={() => addResource()}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateResourceState({ query })}
        />
      }
    >
      {resourceItems.map(({ index, resource }) => (
        <EditorListItem
          title="Select Resource"
          key={index}
          kind="resource"
          name={resource.name}
          type={resource.type}
          onClick={() => {
            updateResourceState({ index })
            if (onResourceSelected) onResourceSelected(resource.name)
          }}
          onRemoveClick={() => removeResource(index)}
        />
      ))}
    </EditorList>
  )
}
