import * as React from 'react'
import VerticalTabs from '../../Library/VerticalTabs'
import Element from '../Content/Element'
import General from '../Content/General'
import PackageImage from '../Content/PackageImage'
import Contributors from '../Content/ContributorsEditor/ContributorsEditor'
import Keywords from '../Content/KeywordsEditor/KeywordsEditor'

export const PACKAGE_EDITORS = [
  'General',
  'Resources',
  'Image',
  'Keywords',
  'Contributors',

  //   'Sources',
  //   'Licences',
  //   'Profiles',
]

const PackageNavigation: React.FC = () => {
  return (
    <VerticalTabs labels={PACKAGE_EDITORS}>
      <General />
      <Element />
      <PackageImage />
      <Keywords />
      <Contributors />
    </VerticalTabs>
  )
}

export default PackageNavigation
