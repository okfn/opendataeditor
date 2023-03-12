import * as React from 'react'
import JsonEditor from '../../Editors/Json/Json'
import { useStore } from './store'

export default function Content() {
  const json = useStore((state) => state.json)
  const path = useStore((state) => state.file.path)
  const loadJson = useStore((state) => state.loadJson)
  const updateChange = useStore((state) => state.updateChange)
  React.useEffect(() => {
    loadJson().catch(console.error)
  }, [path])
  if (!json) return null
  return <JsonEditor path={path} json={json} onChange={updateChange} />
}
