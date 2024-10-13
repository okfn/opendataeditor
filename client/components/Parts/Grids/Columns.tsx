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

  // In conditional rendering props.children still returns an array that includes the 
  // null value. This ensures that the null value is removed from the array
  const childrenNoNull = React.Children.toArray(props.children).filter( (element: React.ReactNode) => element)

  const defaultWidth = Math.round(
    columns / React.Children.count(childrenNoNull)
  ) as GridSize

  return (
    <Grid
      container
      columns={columns}
      columnSpacing={props.spacing}
      sx={{ height: props.height }}
    >
      {React.Children.map(childrenNoNull, (child, index) => (
        <Grid item key={index} md={props.layout ? props.layout[index] : defaultWidth}>
          {child}
        </Grid>
      ))}
    </Grid>
  )
}
