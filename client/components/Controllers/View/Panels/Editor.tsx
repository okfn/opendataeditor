import ViewEditor from '../../../Editors/View'
import { useStore } from '../store'

export default function EditorPanel() {
  const columns = useStore((state) => state.columns)
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  return (
    <ViewEditor
      view={modified}
      columns={columns}
      onChange={(view) => updateState({ modified: view })}
    />
  )
}
