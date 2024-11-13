import TwoButtonDialog from '@client/components/Parts/Dialogs/TwoButton'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { PropsWithChildren } from 'react'
import * as store from './Assistant.store'

export function AssistantDialog() {
  const state = store.useState()

  switch (state.step) {
    case 'terms':
      return <TermsStepDialog />
    case 'creds':
      return <CredsStepDialog />
    case 'prompt':
      return <PromptStepDialog />
  }
}

function TermsStepDialog() {
  return (
    <StepDialog label="Confirm" cancelLabel="Cancel" onConfirm={store.acceptTerms}>
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
      onConfirm={() => store.setApiKey({ key })}
    >
      <Stack spacing={1}>
        <Box>Please enter your OpenAI API key:</Box>
        <StyledTextField
          label="OpenAI API Key"
          variant="outlined"
          fullWidth
          onChange={(ev) => {
            setKey(ev.target.value)
          }}
        />
      </Stack>
    </StepDialog>
  )
}

function PromptStepDialog() {
  return (
    <StepDialog label="Confirm" cancelLabel="Cancel" onConfirm={console.log}>
      Prompt
    </StepDialog>
  )
}

function StepDialog(
  props: PropsWithChildren<{
    label: string
    cancelLabel: string
    disabled?: boolean
    onConfirm: () => void
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
    >
      {props.children}
    </TwoButtonDialog>
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
