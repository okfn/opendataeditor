import MetadataPanel from '../../Base/Panels/Metadata'
import { useStore } from '../store'

export default function Metadata() {
  const resource = useStore((state) => state.resource)
  const updateState = useStore((state) => state.updateState)
  return (
    <MetadataPanel
      resource={resource}
      onChange={(resource) => updateState({ resource })}
    />
  )
}
