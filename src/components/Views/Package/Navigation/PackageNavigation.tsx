import * as React from 'react'
import Tabs from '../../Library/Tabs'
import General from '../Content/General'
import Resources from '../Elements/Resources'

export const PACKAGE_EDITORS = [
  'General',
  'Resources',
  //   'Keywords',
  //   'Contributors',
  //   'Sources',
  //   'Licences',
  //   'Profiles',
]

const PackageNavigation: React.FC = () => {
  return (
    <Tabs orientation="vertical" variant="scrollable" labels={PACKAGE_EDITORS}>
      <General />
      <Resources />
    </Tabs>
  )
}

export default PackageNavigation
