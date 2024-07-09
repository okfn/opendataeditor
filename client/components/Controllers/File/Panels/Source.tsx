import { TextSourcePanel } from '../../Base/Panels/Source'
import * as store from '@client/store'

export default function Source() {
  const source = store.useStore((state) => state.source)
  if (!source?.text) return null

  return <TextSourcePanel value={source.text} />
}
