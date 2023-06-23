import * as React from 'react'
import Chip from '@mui/material/Chip'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import LightTooltip from '../Tooltips/Light'

// TODO: create BaseChip

export interface ArticleChipProps {
  onClick: () => void
}

export default function ArticleChip(props: ArticleChipProps) {
  return (
    <LightTooltip title="Create a Markdown article">
      <Chip
        onClick={props.onClick}
        color="primary"
        label="Article"
        icon={<HistoryEduIcon />}
        size="medium"
        sx={{
          height: '100%',
          borderLeft: 'solid 1px #ddd',
          borderRadius: '3px',
        }}
      />
    </LightTooltip>
  )
}
