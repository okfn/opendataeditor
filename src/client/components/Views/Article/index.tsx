import * as React from 'react'
import Box from '@mui/material/Box'
import InnerHtml from 'dangerously-set-html-content'

export interface ArticleProps {
  text?: string
}

export default function Article(props: ArticleProps) {
  if (!props.text) return null
  return (
    <Box sx={{ paddingX: 2 }}>
      <InnerHtml key={props.text} html={props.text} />
    </Box>
  )
}
