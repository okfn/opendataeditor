import * as React from 'react'
import VerticalTabs from '../../../Parts/VerticalTabs'
import Element from '../Content/Element'
import General from '../Content/General'
import PackageImage from '../Content/PackageImage'
import Keywords from '../Content/KeywordsEditor/KeywordsEditor'
import Contributors from '../Content/Contributors'
import { useStore } from '../store'

export const PACKAGE_EDITORS = [
  'General',
  'Resources',
  'Image',
  'Keywords',
  'Contributors',
  //   'Keywords',
  //   'Sources',
  //   'Licences',
  //   'Profiles',
]

const PackageNavigation: React.FC = () => {
  const setElementGroup = useStore((state) => state.setElementGroup)
  const setElementName = useStore((state) => state.setElementName)

  // Event Handlers
  function handleChange(newValue?: any) {
    if (newValue) {
      setElementGroup(PACKAGE_EDITORS[newValue].toLowerCase())
      setElementName('')
    }
  }
  return (
    <VerticalTabs labels={PACKAGE_EDITORS} onChange={handleChange}>
      <General />
      <Element />
      <PackageImage />
      <Keywords />
      <Contributors />
    </VerticalTabs>
  )
}

export default PackageNavigation
