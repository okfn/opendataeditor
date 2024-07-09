import ReportPanel from '../../Base/Panels/Report'
import * as store from '@client/store'

export default function Report() {
  const report = store.useStore((state) => state.report)
  return <ReportPanel report={report} />
}
