import { JsonSourcePanel } from '../../Base/Panels/Source'
import { useStore } from '../store'

export default function Source() {
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  return (
    <JsonSourcePanel
      value={modified}
      onChange={(value) => updateState({ modified: value })}
    />
  )
}
