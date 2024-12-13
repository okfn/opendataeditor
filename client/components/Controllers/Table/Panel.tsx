import * as store from '@client/store'
import ScrollBox from '../../Parts/Boxes/Scroll'
import MetadataPanel from './Panels/Metadata'
import ReportPanel from './Panels/Report'
import SourcePanel from './Panels/Source'

export default function Panel() {
  const panel = store.useStore((state) => state.panel)

  return (
    <ScrollBox
      hidden={!panel}
      height={'100%'}
      sx={{
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
