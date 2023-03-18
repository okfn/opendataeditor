import * as React from 'react'
import EditorSection from '../../../Parts/Editor/EditorSection'
import { useStore } from '../store'

export default function General() {
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <EditorSection
      name="Csv"
      onHeadingClick={() => updateHelp('dialect/csv')}
    ></EditorSection>
  )
}
