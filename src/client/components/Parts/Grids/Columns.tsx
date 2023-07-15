import * as React from 'react'
import Grid, { GridSize } from '@mui/material/Grid'

// TODO: improve logic

interface ColumnsProps {
  spacing?: number
  layout?: GridSize[]
  height?: string
  columns?: number
}

export default function Columns(props: React.PropsWithChildren<ColumnsProps>) {
  const columns = props.columns || 12
  const defaultWidth = Math.round(
    columns / React.Children.count(props.children)
  ) as GridSize
  return (
    <Grid
      container
      columns={columns}
      columnSpacing={props.spacing}
      sx={{ height: props.height }}
    >
      {React.Children.map(props.children, (child, index) => (
        <Grid item key={index} md={props.layout ? props.layout[index] : defaultWidth}>
          {child}
        </Grid>
      ))}
    </Grid>
  )
}
