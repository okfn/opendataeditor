import * as React from 'react'
import BasicChip from '../../../../Parts/Chips'

interface KeywordsItemProps {
  keyword: string
  onDelete: (keyword: string) => void
}
export default function KeywordsItem({ keyword, onDelete }: KeywordsItemProps) {
  return (
    <>
      <BasicChip
        label={keyword}
        onDelete={() => {
          onDelete(keyword)
        }}
      />
    </>
  )
}
