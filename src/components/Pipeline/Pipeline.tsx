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
import { IPipeline } from '../../interfaces/pipeline'
import * as helpers from '../../helpers'

export interface PipelineProps {
  pipeline: IPipeline
  onSave?: (pipeline: IPipeline) => void
}

interface PipelineState {
  next: IPipeline
  prev: IPipeline
  onSave: (pipeline: IPipeline) => void
  isPreview: boolean
  isUpdated: boolean
  stepIndex: number
  setStep: (stepIndex: number) => void
  updateStep: (patch: object) => void
  removeStep: () => void
  addStep: () => void
  update: (patch: object) => void
  preview: () => void
  revert: () => void
  save: () => void
}

function makeStore(props: PipelineProps) {
  const pipeline = props.pipeline
  const onSave = props.onSave || noop
  return create<PipelineState>((set, get) => ({
    next: cloneDeep(pipeline),
    prev: pipeline,
    onSave,
    isPreview: false,
    isUpdated: false,
    stepIndex: 0,
    setStep: (stepIndex) => {
      set({ stepIndex })
    },
    updateStep: (patch) => {
      const { next, stepIndex } = get()
      const pipeline = produce(next, (pipeline) => {
        pipeline.steps[stepIndex] = { ...pipeline.steps[stepIndex], ...patch }
      })
      set({ next: pipeline, isUpdated: true })
    },
    addStep: () => {
      const { next } = get()
      const pipeline = produce(next, (pipeline) => {
        pipeline.steps.push({
          code: 'field-add',
          descriptor: '',
        })
      })
      const stepIndex = pipeline.steps.length - 1
      set({ next: pipeline, stepIndex, isUpdated: true })
      console.log(get())
    },
    removeStep: () => {
      const { next, stepIndex } = get()
      const pipeline = produce(next, (pipeline) => {
        pipeline.steps.splice(stepIndex, 1)
      })
      set({ next: pipeline, stepIndex: Math.max(stepIndex - 1, 0), isUpdated: true })
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
      set({ next: cloneDeep(prev), isUpdated: false, stepIndex: 0 })
    },
    save: () => {
      const { onSave, next } = get()
      set({ prev: cloneDeep(next), isUpdated: false, stepIndex: 0 })
      onSave(next)
    },
  }))
}

const { Provider, useStore } = createContext<PipelineState>()
export default function Pipeline(props: PipelineProps) {
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
        <Steps />
      </Grid>
      <Grid item xs={6}>
        <Menu />
      </Grid>
    </Grid>
  )
}

function Preview() {
  const pipeline = useStore((state) => state.next)
  return (
    <pre>
      <code>{JSON.stringify(pipeline, null, 2)}</code>
    </pre>
  )
}

function General() {
  const pipeline = useStore((state) => state.next)
  // const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField
        disabled
        label="Source"
        margin="normal"
        value={pipeline.source?.path || ''}
      />
      <TextField
        disabled
        label="Target"
        margin="normal"
        value={pipeline.source?.path || ''}
      />
    </FormControl>
  )
}

function Steps() {
  const stepIndex = useStore((state) => state.stepIndex)
  const step = useStore((state) => (state.next.steps || [])[stepIndex])
  const updateField = useStore((state) => state.updateStep)
  if (!step) return null
  return (
    <FormControl>
      <Typography variant="h6">Steps</Typography>
      <TextField
        label="Code"
        margin="normal"
        value={step.code}
        onChange={(ev) => updateField({ code: ev.target.value })}
      />
      <TextField
        label="Descriptor"
        margin="normal"
        value={step.descriptor || ''}
        onChange={(ev) => updateField({ descriptor: ev.target.value })}
      />
    </FormControl>
  )
}

function Menu() {
  const pipeline = useStore((state) => state.next)
  const stepIndex = useStore((state) => state.stepIndex)
  const setStep = useStore((state) => state.setStep)
  const addStep = useStore((state) => state.addStep)
  const removeStep = useStore((state) => state.removeStep)
  return (
    <Box>
      <Typography variant="h6">&nbsp;</Typography>
      <Box sx={{ pb: 2, borderBottom: 'dashed 1px #ccc' }}>
        <Button
          variant="outlined"
          color="success"
          sx={{ mt: 2, mr: 2 }}
          onClick={addStep}
        >
          Add Step
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 2, mr: 2 }}
          onClick={removeStep}
        >
          Remove Step
        </Button>
      </Box>
      <Box>
        {pipeline.steps.map((step: any, index: any) => (
          <Button
            variant={index === stepIndex ? 'contained' : 'outlined'}
            onClick={() => setStep(index)}
            key={index}
            sx={{ mt: 2, mr: 2 }}
          >
            {step.code}
          </Button>
        ))}
      </Box>
    </Box>
  )
}

function Actions() {
  const pipeline = useStore((state) => state.next)
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
          download={'pipeline.json'}
          href={helpers.exportDescriptor(pipeline)}
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
