import { Button, Toolbar, Typography } from '@mui/material'
import * as React from 'react'

type MenuItem = {
  key: string
  label: string
  icon: React.ReactElement
  disabled: boolean
  onClick: () => void
}

export default function MenuBar({ items }: { items: Array<MenuItem> }) {
  return (
    <Toolbar>
      {items.map((menu: MenuItem) => (
        <Button
          key={menu.key}
          startIcon={menu.icon}
          onClick={menu.onClick}
          disabled={menu.disabled}
        >
          <Typography sx={{ mX: 2, fontWeight: 300 }}>{menu.label}</Typography>
        </Button>
      ))}
    </Toolbar>
  )
}
