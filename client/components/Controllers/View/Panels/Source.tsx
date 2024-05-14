import { JsonSourcePanel } from '../../Base/Panels/Source'
import { useStore } from '../store'

export default function Source() {
  const modified = useStore((state) => state.modified)
  return <JsonSourcePanel value={modified} />
}
