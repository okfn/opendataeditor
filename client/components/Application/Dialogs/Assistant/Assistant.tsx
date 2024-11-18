import TwoButtonDialog from '@client/components/Parts/Dialogs/TwoButton'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import { startCase } from 'lodash'
import * as React from 'react'
import { PropsWithChildren } from 'react'
import Markdown from 'react-markdown'
import * as store from './Assistant.store'

const DEFAULT_PROMPT = `
suggest improvements to the names of the columns in the table 
and provide descriptions for each of them
`

export function AssistantDialog() {
  const state = store.useState()

  switch (state.step) {
    case 'terms':
      return <TermsStepDialog />
    case 'creds':
      return <CredsStepDialog />
    case 'prompt':
      return <PromptStepDialog />
    case 'result':
      return <ResultStepDialog />
  }
}

function TermsStepDialog() {
  return (
    <StepDialog
      label="Confirm"
      cancelLabel="Cancel"
      transitionDuration={{ exit: 0 }}
      onConfirm={store.acceptTerms}
    >
      If you proceed, the Open Data Editor will only share the names of the columns in
      your table to suggest improvements to the titles and descriptions associated with
      them. Do you want to proceed?
    </StepDialog>
  )
}

function CredsStepDialog() {
  const [key, setKey] = React.useState('')

  return (
    <StepDialog
      label="Confirm"
      cancelLabel="Cancel"
      disabled={!key}
      transitionDuration={0}
      onConfirm={() => store.setApiKey({ key })}
    >
      <Stack spacing={1}>
        <Box>Please enter your OpenAI API key:</Box>
        <StyledTextField
          fullWidth
          label="OpenAI API Key"
          variant="outlined"
          value={key}
          inputProps={{ spellCheck: false }}
          onChange={(ev) => {
            setKey(ev.target.value)
          }}
        />
      </Stack>
    </StepDialog>
  )
}

function PromptStepDialog() {
  const [prompt, setPrompt] = React.useState(DEFAULT_PROMPT)

  return (
    <StepDialog
      label="Confirm"
      cancelLabel="Cancel"
      transitionDuration={0}
      onConfirm={() => store.setPromptAndFetchResult({ prompt })}
    >
      <Stack spacing={1}>
        <Box>Please enter your prompt to the AI assistant:</Box>
        <StyledTextField
          value={prompt}
          label="OpenAI API Key"
          variant="outlined"
          fullWidth
          onChange={(ev) => {
            setPrompt(ev.target.value)
          }}
        />
      </Stack>
    </StepDialog>
  )
}

function ResultStepDialog() {
  const state = store.useState()

  return (
    <StepDialog
      label="OK"
      disabled={state.progress?.blocking}
      transitionDuration={{ enter: 0 }}
      onConfirm={store.closeDialog}
    >
      {state.result && <Markdown>{state.result}</Markdown>}
      <ProgressIndicator />
    </StepDialog>
  )
}

function StepDialog(
  props: PropsWithChildren<{
    label: string
    onConfirm: () => void
    cancelLabel?: string
    disabled?: boolean
    transitionDuration?: number | { enter?: number; exit?: number }
  }>
) {
  return (
    <TwoButtonDialog
      open={true}
      maxWidth="md"
      title="AI Assistant"
      Icon={AutoFixHighIcon}
      label={props.label}
      disabled={props.disabled}
      cancelLabel={props.cancelLabel}
      onCancel={store.closeDialog}
      onConfirm={props.onConfirm}
      transitionDuration={props.transitionDuration}
    >
      {props.children}
    </TwoButtonDialog>
  )
}

// TODO: move to the common library
function ProgressIndicator() {
  const { progress } = store.useState()

  if (!progress) {
    return null
  }

  if (progress.type === 'error') {
    return (
      <Box sx={{ py: '1em' }}>
        <Box sx={{ color: 'red' }}>{progress.message}</Box>
      </Box>
    )
  }

  return (
    <Stack spacing={1} sx={{ mt: '1em' }}>
      <Box>{startCase(progress.type)}...</Box>
      <LinearProgress
        sx={{
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#00D1FF',
          },
          padding: '10px',
        }}
      />
      <Box sx={{ color: 'gray' }}>{progress.message}</Box>
    </Stack>
  )
}

// TODO: move to the common library
const StyledTextField = styled(TextField)(() => ({
  marginTop: '8px',
  fontSize: '14px',
  '& label.Mui-focused': {
    color: '#00D1FF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#00D1FF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'gray',
    },
    '&:hover fieldset': {
      borderColor: '#00D1FF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00D1FF',
    },
  },
}))
