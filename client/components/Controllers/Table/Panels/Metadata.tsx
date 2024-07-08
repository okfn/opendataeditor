import MetadataPanel from '../../Base/Panels/Metadata'
import * as store from '@client/store'

export default function Metadata() {
  const resource = store.useStore((state) => state.resource)

  return (
    <MetadataPanel
      resource={resource}
      onChange={store.updateResource}
      onFieldSelected={(name) => store.setTableSelection({ columnName: name })}
    />
  )
}
