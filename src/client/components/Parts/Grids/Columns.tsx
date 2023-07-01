import * as React from 'react'
import Grid, { GridSize } from '@mui/material/Grid'

// TODO: improve logic

interface ColumnsProps {
  spacing?: number
  layout?: GridSize[]
  height?: string
}

export default function Columns(props: React.PropsWithChildren<ColumnsProps>) {
  const defaultWidth = Math.round(12 / React.Children.count(props.children)) as GridSize
  return (
    <Grid
      container
      columnSpacing={props.spacing}
      sx={{ height: props.height || undefined }}
    >
      {React.Children.map(props.children, (child, index) => (
        <Grid item key={index} md={props.layout ? props.layout[index] : defaultWidth}>
          {child}
        </Grid>
      ))}
    </Grid>
  )
}
