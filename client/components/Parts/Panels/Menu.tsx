import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../Grids/Columns'
import MenuTree, { MenuTreeProps } from '../Trees/Menu'

export interface MenuPanelProps extends MenuTreeProps {
  children: React.ReactNode
}

export default function MenuPanel(props: MenuPanelProps) {
  const { children, ...rest } = props
  const selectedIndex = props.menuItems.findIndex(
    (item) => item.section === props.selected
  )
  return (
    <Columns spacing={3} layout={[3, 9]}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <MenuTree {...rest} />
      </Box>
      <Box>
        {React.Children.map(children, (node, index) => (
          <Box hidden={index !== selectedIndex}>{node}</Box>
        ))}
      </Box>
    </Columns>
  )
}
