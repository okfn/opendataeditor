import * as React from 'react'
import produce from 'immer'
import create from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { IInquiryTask } from '../../interfaces/inquiry'
import * as helpers from '../../helpers'

export interface TaskProps {
  task: IInquiryTask
  onSave?: (task: IInquiryTask) => void
}

interface TaskState {
  next: IInquiryTask
  prev: IInquiryTask
  onSave: (task: IInquiryTask) => void
  isPreview: boolean
  isUpdated: boolean
  checkIndex: number
  setCheck: (checkIndex: number) => void
  updateCheck: (patch: object) => void
  removeCheck: () => void
  addCheck: () => void
  update: (patch: object) => void
  preview: () => void
  revert: () => void
  save: () => void
}

function makeStore(props: TaskProps) {
  const task = props.task
  const onSave = props.onSave || noop
  return create<TaskState>((set, get) => ({
    next: cloneDeep(task),
    prev: task,
    onSave,
    isPreview: false,
    isUpdated: false,
    checkIndex: 0,
    setCheck: (checkIndex) => {
      set({ checkIndex })
    },
    updateCheck: (patch) => {
      const { next, checkIndex } = get()
      const task = produce(next, (task) => {
        task.checks[checkIndex] = { ...task.checks[checkIndex], ...patch }
      })
      set({ next: task, isUpdated: true })
    },
    addCheck: () => {
      const { next } = get()
      const task = produce(next, (task) => {
        task.checks.push({
          code: 'duplicate-row',
          descriptor: '',
        })
      })
      const checkIndex = task.checks.length - 1
      set({ next: task, checkIndex, isUpdated: true })
      console.log(get())
    },
    removeCheck: () => {
      const { next, checkIndex } = get()
      const task = produce(next, (task) => {
        task.checks.splice(checkIndex, 1)
      })
      set({ next: task, checkIndex: Math.max(checkIndex - 1, 0), isUpdated: true })
    },
    update: (patch) => {
      const { next } = get()
      set({ next: { ...next, ...patch }, isUpdated: true })
    },
    preview: () => {
      const { isPreview } = get()
      set({ isPreview: !isPreview })
    },
    revert: () => {
      const { prev } = get()
      set({ next: cloneDeep(prev), isUpdated: false, checkIndex: 0 })
    },
    save: () => {
      const { onSave, next } = get()
      set({ prev: cloneDeep(next), isUpdated: false, checkIndex: 0 })
      onSave(next)
    },
  }))
}

const { Provider, useStore } = createContext<TaskState>()
export default function Task(props: TaskProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Editor />
      <Actions />
    </Provider>
  )
}

function Editor() {
  const isPreview = useStore((state) => state.isPreview)
  if (isPreview) return <Preview />
  return (
    <Grid container>
      <Grid item xs={3}>
        <General />
      </Grid>
      <Grid item xs={3}>
        <Checks />
      </Grid>
      <Grid item xs={6}>
        <Menu />
      </Grid>
    </Grid>
  )
}

function Preview() {
  const task = useStore((state) => state.next)
  return (
    <pre>
      <code>{JSON.stringify(task, null, 2)}</code>
    </pre>
  )
}

function General() {
  const task = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField
        label="Pick Errors"
        margin="normal"
        multiline
        value={(task.pickErrors || []).join(',')}
        onChange={(ev) => update({ pickErrors: ev.target.value.split(',') })}
      />
      <TextField
        label="Skip Errors"
        margin="normal"
        multiline
        value={(task.skipErrors || []).join(',')}
        onChange={(ev) => update({ skipErrors: ev.target.value.split(',') })}
      />
      <TextField
        type="number"
        label="Limit Errors"
        margin="normal"
        inputProps={{ min: 1 }}
        value={task.limitErrors || ''}
        onChange={(ev) => update({ limitErrors: parseInt(ev.target.value) })}
      />
    </FormControl>
  )
}

function Checks() {
  const checkIndex = useStore((state) => state.checkIndex)
  const check = useStore((state) => state.next.checks[checkIndex])
  const updateField = useStore((state) => state.updateCheck)
  return (
    <FormControl>
      <Typography variant="h6">Checks</Typography>
      <TextField
        label="Code"
        margin="normal"
        value={check.code}
        onChange={(ev) => updateField({ code: ev.target.value })}
      />
      <TextField
        label="Descriptor"
        margin="normal"
        value={check.descriptor || ''}
        onChange={(ev) => updateField({ descriptor: ev.target.value })}
      />
    </FormControl>
  )
}

function Menu() {
  const task = useStore((state) => state.next)
  const checkIndex = useStore((state) => state.checkIndex)
  const setCheck = useStore((state) => state.setCheck)
  const addCheck = useStore((state) => state.addCheck)
  const removeCheck = useStore((state) => state.removeCheck)
  return (
    <Box>
      <Typography variant="h6">&nbsp;</Typography>
      <Box sx={{ pb: 2, borderBottom: 'dashed 1px #ccc' }}>
        <Button
          variant="outlined"
          color="success"
          sx={{ mt: 2, mr: 2 }}
          onClick={addCheck}
        >
          Add Check
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 2, mr: 2 }}
          onClick={removeCheck}
        >
          Remove Check
        </Button>
      </Box>
      <Box>
        {task.checks.map((check: any, index: any) => (
          <Button
            variant={index === checkIndex ? 'contained' : 'outlined'}
            onClick={() => setCheck(index)}
            key={index}
            sx={{ mt: 2, mr: 2 }}
          >
            {check.code}
          </Button>
        ))}
      </Box>
    </Box>
  )
}

function Actions() {
  const task = useStore((state) => state.next)
  const isPreview = useStore((state) => state.isPreview)
  const isUpdated = useStore((state) => state.isUpdated)
  const preview = useStore((state) => state.preview)
  const revert = useStore((state) => state.revert)
  const save = useStore((state) => state.save)
  return (
    <Box>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Stack spacing={2} direction="row" sx={{ pl: 0 }}>
        <Button
          variant="contained"
          download={'inqury-task.json'}
          href={helpers.exportDescriptor(task)}
        >
          Export
        </Button>
        <Button
          variant={isPreview ? 'outlined' : 'contained'}
          onClick={preview}
          color="warning"
        >
          Preview
        </Button>
        <Button variant="contained" disabled={!isUpdated} onClick={revert} color="error">
          Revert
        </Button>
        <Button variant="contained" disabled={!isUpdated} onClick={save} color="success">
          Save
        </Button>
      </Stack>
    </Box>
  )
}
