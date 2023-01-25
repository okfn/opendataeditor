import * as React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useStore } from '../../store'
import KeywordsInput from './KeywordsInput'
import KeywordsItem from './KeywordsItem'

export default function Keywords() {
  const theme = useTheme()
  const keywordsList = useStore((state) => state.descriptor.keywords) || []
  const update = useStore((state) => state.update)
  // logic
  const onAdd = (keyword: string) => {
    const keywords = [keyword, ...keywordsList]
    update({ keywords })
  }
  const onDelete = (keyword: string) => {
    const newKeywordsList = keywordsList.filter((item) => item !== keyword)
    update({ keywords: newKeywordsList })
  }

  return (
    <div>
      <KeywordsInput onAdd={onAdd} />
      <Box
        sx={{
          height: theme.spacing(34),
          maxHeight: theme.spacing(34),
          overflowY: 'scroll',
        }}
      >
        <Grid container spacing={3}>
          {keywordsList.map((keyword) => {
            return (
              <Grid
                item
                key={Math.floor(Math.random() * (10000 - 0) + 0) + keyword.slice(0, 3)}
              >
                <KeywordsItem keyword={keyword} onDelete={onDelete} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </div>
  )
}
