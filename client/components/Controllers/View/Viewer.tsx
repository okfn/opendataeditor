import TableEditor from '../../Editors/Table'
import { useStore } from './store'

export default function Editor() {
  const loader = useStore((state) => state.loader)
  const schema = useStore((state) => state.schema)
  if (!schema) return null
  return <TableEditor source={loader} schema={schema} />
}
