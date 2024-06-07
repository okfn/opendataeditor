import EditorList from '../../Base/List'
import EditorListItem from '../../Base/ListItem'
import EditorSearch from '../../Base/Search'
import { useStore } from '../store'

export default function Resources() {
  const layers = useStore((state) => state.layers)
  const query = useStore((state) => state.layerState.query)
  const addLayer = useStore((state) => state.addLayer)
  const removeLayer = useStore((state) => state.removeLayer)
  const updateLayerState = useStore((state) => state.updateLayerState)
  return (
    <EditorList
      kind="layer"
      query={query}
      onAddClick={() => addLayer()}
      SearchInput={
        <EditorSearch
          value={query || ''}
          onChange={(query) => updateLayerState({ query })}
        />
      }
    >
      {layers.slice(1).map((layer, index) => (
        <EditorListItem
          title="Select Layer"
          key={index + 1}
          kind="layer"
          name={layer}
          type="layer"
          onClick={() => {
            // TODO: implement
          }}
          onRemoveClick={() => removeLayer(index + 1)}
        />
      ))}
    </EditorList>
  )
}
