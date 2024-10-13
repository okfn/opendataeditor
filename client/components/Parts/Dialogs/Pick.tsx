import * as React from 'react'
import List from '@mui/material/List'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import ConfirmDialog, { ConfirmDialogProps } from './OneButton'

interface PickDialogProps extends Omit<ConfirmDialogProps, 'onConfirm'> {
  items: string[]
  onConfirm: (items: string[]) => void
}

export default function PickDialog(props: PickDialogProps) {
  const { items: propsItems, onConfirm, ...rest } = props
  const [checked, setChecked] = React.useState<readonly number[]>([])
  const available = Array.from(propsItems.keys())
  const leftChecked = intersection(checked, available)

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const numberOfChecked = (items: readonly number[]) =>
    intersection(checked, items).length

  const handleToggleAll = (items: readonly number[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const customList = (title: React.ReactNode, items: readonly number[]) => (
    <Card sx={{ width: 'fit-content', minWidth: '100%' }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          bgcolor: 'background.paper',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
        dense
        component="div"
        role="list"
      >
        {propsItems.map((value, index) => {
          const labelId = `transfer-list-all-item-${index}-label`

          return (
            <ListItem
              dense
              key={index}
              role="listitem"
              button
              onClick={handleToggle(index)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(index) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Card>
  )

  return (
    <ConfirmDialog
      {...rest}
      onConfirm={() =>
        onConfirm(propsItems.filter((_, index) => leftChecked.includes(index)))
      }
    >
      {customList('Items', available)}
    </ConfirmDialog>
  )
}

function not(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a: readonly number[], b: readonly number[]) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

function union(a: readonly number[], b: readonly number[]) {
  return [...a, ...not(b, a)]
}
