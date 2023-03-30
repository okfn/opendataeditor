import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'

export interface IMenuBarItem {
  key: string
  label: string
  disabled: boolean
  type: string
  options?: any
  icon?: React.ReactElement
  onClick?: (event?: any) => void
  color?: 'info' | 'warning'
}

export default function MenuBar({ items }: { items: Array<IMenuBarItem> }) {
  return (
    <Toolbar sx={{ borderBottom: 'solid 1px #ddd', backgroundColor: '#fafafa' }}>
      {items.map((menu: IMenuBarItem) => getMenu(menu))}
    </Toolbar>
  )
}
const getMenu = (menu: IMenuBarItem) => {
  const Elem = menus[menu.type]
  return <Elem key={menu.key} menu={menu} />
}

const CheckboxMenuItem = (props: { menu: IMenuBarItem }) => {
  return (
    <Box
      sx={{
        fontWeight: 300,
        color: props.menu.color || 'primary.info',
      }}
    >
      <Checkbox onClick={props.menu.onClick} disabled={props.menu.disabled} />
      {props.menu.label}
    </Box>
  )
}

const SelectMenuItem = (props: { menu: IMenuBarItem }) => {
  return (
    <Box
      sx={{
        fontWeight: 300,
        color: props.menu.color || 'primary.info',
      }}
    >
      <Box
        component="span"
        sx={{
          paddingRight: 1,
        }}
      >
        {props.menu.label}
      </Box>
      <Select
        size="small"
        defaultValue="0"
        disabled={props.menu.disabled}
        onChange={props.menu.onClick}
      >
        {props.menu.options.map((option: any, index: number) => (
          <MenuItem key={index} value={index}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}

const DefaultMenuItem = (props: { menu: IMenuBarItem }) => {
  return (
    <Button
      key={props.menu.key}
      startIcon={props.menu.icon}
      onClick={props.menu.onClick}
      disabled={props.menu.disabled}
      color={props.menu.color}
    >
      <Typography sx={{ fontWeight: 300, textTransform: 'capitalize' }}>
        {props.menu.label}
      </Typography>
    </Button>
  )
}

const menus: { [key: string]: React.ElementType } = {
  default: DefaultMenuItem,
  checkbox: CheckboxMenuItem,
  select: SelectMenuItem,
}
