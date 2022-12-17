import * as React from 'react'
import VerticalTabs from '../../Library/VerticalTabs'
import Element from '../Content/Element'
import General from '../Content/General'
import PackageImage from '../Content/PackageImage'
import Contributors from '../Content/ContributorsEditor/ContributorsEditor'

export const PACKAGE_EDITORS = [
  'Contributors',
  'General',
  'Resources',
  'Image',
  //   'Keywords',
  //   'Sources',
  //   'Licences',
  //   'Profiles',
]

const PackageNavigation: React.FC = () => {
  return (
    <VerticalTabs labels={PACKAGE_EDITORS}>
      <Contributors />
      <General />
      <Element />
      <PackageImage />
    </VerticalTabs>
  )
}

export default PackageNavigation
