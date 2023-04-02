import * as React from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Columns from './Columns'

interface SelectorProps {
  items: string[]
  onSelect: (items: string[]) => void
  onCancel: (items: string[]) => void
}

export default function Selector(props: SelectorProps) {
  const [checked, setChecked] = React.useState<readonly number[]>([])
  const available = Array.from(props.items.keys())

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
    <Card>
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
        {props.items.map((value, index) => {
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
    <Box>
      {customList('Items', available)}
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            variant={leftChecked.length === 0 ? 'outlined' : 'contained'}
            size="small"
            onClick={() =>
              props.onCancel(
                props.items.filter((_, index) => leftChecked.includes(index))
              )
            }
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
            color={leftChecked.length === 0 ? 'primary' : 'warning'}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            variant={leftChecked.length === 0 ? 'outlined' : 'contained'}
            size="small"
            onClick={() =>
              props.onSelect(
                props.items.filter((_, index) => leftChecked.includes(index))
              )
            }
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            Select
          </Button>
        </Columns>
      </Box>
    </Box>
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
