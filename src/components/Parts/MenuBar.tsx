import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Toolbar,
  Typography
} from '@mui/material'
import * as React from 'react'

type MenuItem = {
  key: string
  label: string
  disabled: boolean
  type: string
  icon?: React.ReactElement
  onClick?: () => void
}

export default function MenuBar({ items }: { items: Array<MenuItem> }) {
  return <Toolbar>{items.map((menu: MenuItem) => getMenu(menu))}</Toolbar>
}
const getMenu = (menu: MenuItem) => {
  const Elem = menus[menu.type]
  return <Elem key={menu.key} menu={menu} />
}

const CheckboxMenuItem = (props: { menu: MenuItem }) => {
  return (
    <FormGroup>
      <FormControlLabel
        sx={{
          mX: 2,
          '& .MuiFormControlLabel-label': { fontWeight: 300, color: 'primary.main' },
        }}
        control={
          <Checkbox
            defaultChecked
            onClick={props.menu.onClick}
            disabled={props.menu.disabled}
          />
        }
        label={props.menu.label}
      />
    </FormGroup>
  )
}

const DefaultMenuItem = (props: { menu: MenuItem }) => {
  return (
    <Button
      key={props.menu.key}
      startIcon={props.menu.icon}
      onClick={props.menu.onClick}
      disabled={props.menu.disabled}
    >
      <Typography sx={{ mX: 2, fontWeight: 300, textTransform: 'capitalize' }}>
        {props.menu.label}
      </Typography>
    </Button>
  )
}

const menus: { [key: string]: React.ElementType } = {
  default: DefaultMenuItem,
  checkbox: CheckboxMenuItem,
}
