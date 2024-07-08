import { TextSourcePanel } from '../../Base/Panels/Source'
import * as store from '@client/store'

export default function Source() {
  const source = store.useStore((state) => state.table?.source)

  return <TextSourcePanel value={source} />
}
