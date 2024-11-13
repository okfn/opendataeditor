import ScrollBox from '../../Parts/Boxes/Scroll'
import MetadataPanel from './Panels/Metadata'
import ReportPanel from './Panels/Report'
import SourcePanel from './Panels/Source'
import * as store from '@client/store'

export default function Panel() {
  const panel = store.useStore((state) => state.panel)

  return (
    <ScrollBox
      hidden={!panel}
      height={'100%'}
      sx={{
        borderTop: 'solid 1px #ddd',
        backgroundColor: 'white',
        width: '100%',
      }}
    >
      {panel === 'metadata' && <MetadataPanel />}
      {panel === 'report' && <ReportPanel />}
      {panel === 'source' && <SourcePanel />}
    </ScrollBox>
  )
}
