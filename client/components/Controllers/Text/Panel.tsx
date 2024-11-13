import ScrollBox from '../../Parts/Boxes/Scroll'
import MetadataPanel from './Panels/Metadata'
import ReportPanel from './Panels/Report'
import * as store from '@client/store'

export default function Layout() {
  const panel = store.useStore((state) => state.panel)

  return (
    <ScrollBox
      hidden={!panel}
      height="100%"
      sx={{ borderTop: 'solid 1px #ddd', position: 'absolute', backgroundColor: 'white' }}
    >
      {panel === 'metadata' && <MetadataPanel />}
      {panel === 'report' && <ReportPanel />}
    </ScrollBox>
  )
}
