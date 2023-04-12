import * as React from 'react'
import camelCase from 'lodash/camelCase'
import Columns from '../../Parts/Columns'
import Query from './Sections/Query'
import VerticalTabs from '../../Parts/Tabs/Vertical'
import EditorHelp from '../../Parts/Editor/EditorHelp'
import { useStore } from './store'

const LABELS = ['Query']

export default function Layout() {
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <Columns spacing={2} layout={[9, 3]}>
      <VerticalTabs
        labels={LABELS}
        onChange={(index) => {
          updateHelp(camelCase(LABELS[index]))
        }}
      >
        <Query />
      </VerticalTabs>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}
