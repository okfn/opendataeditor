import { TextSourcePanel } from '../../Base/Panels/Source'
import { useStore } from '../store'

export default function Source() {
  const textSource = useStore((state) => state.textSource)
  if (!textSource) return null
  return <TextSourcePanel value={textSource} />
}
