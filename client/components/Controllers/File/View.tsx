import Image from '../../Views/Image'
import Map from '../../Views/Map'
import Missing from '../../Views/Missing'
import * as store from '@client/store'

export default function View() {
  const type = store.useStore((state) => state.record?.type)
  const format = store.useStore((state) => state.record?.resource.format)
  const source = store.useStore((state) => state.source)

  if (type === 'image' && source?.bytes) {
    return <Image format={format} bytes={source.bytes} />
  }

  if (type === 'map' && source?.text) {
    return <Map text={source.text} />
  }

  return <Missing format={format} />
}
