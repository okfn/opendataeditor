import * as React from 'react'
import Text from '../../Editors/Text'
import { useStore } from './store'

export default function Content() {
  const text = useStore((state) => state.text)
  const path = useStore((state) => state.file.path)
  const loadFile = useStore((state) => state.loadFile)
  const updateChange = useStore((state) => state.updateChange)
  React.useEffect(() => {
    loadFile().catch(console.error)
  }, [path])
  if (!text) return null
  return <Text path={path} text={text} onChange={updateChange} />
}
