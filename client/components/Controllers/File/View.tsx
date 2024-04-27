import Image from '../../Views/Image'
import Map from '../../Views/Map'
import { useStore } from './store'

export default function View() {
  const type = useStore((state) => state.record?.type)
  const format = useStore((state) => state.record?.resource.format)
  const byteSource = useStore((state) => state.byteSource)
  const textSource = useStore((state) => state.textSource)

  if (!type) return null
  if (type === 'image') return <Image format={format} bytes={byteSource} />
  if (type === 'map') return <Map text={textSource} />
  return
}
