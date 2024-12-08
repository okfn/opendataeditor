import TwoButtonDialog from '@client/components/Parts/Dialogs/TwoButton'
import { LinearProgress } from '@client/components/Progress'
import * as appStore from '@client/store'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { Box, Link } from '@mui/material'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { PropsWithChildren } from 'react'
import Markdown from 'react-markdown'
import * as store from './store'
import { t } from 'i18next'
import { Trans } from 'react-i18next'

const DEFAULT_PROMPT = t('AI-assistant-default-prompt')

export function AssistantDialog() {
  const state = store.useState()
  const dialog = appStore.useStore((state) => state.dialog)

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

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
      label={t('confirm')}
      cancelLabel={t('cancel')}
      transitionDuration={{ exit: 0 }}
      onConfirm={store.acceptTerms}
    >
      {t('assistant-step-dialog')}
    </StepDialog>
  )
}

function CredsStepDialog() {
  const [key, setKey] = React.useState('')

  return (
    <StepDialog
      label={t('confirm')}
      cancelLabel={t('cancel')}
      confirmDisabled={!key}
      transitionDuration={0}
      onConfirm={() => store.setApiKey({ key })}
    >
      <Stack spacing={1}>
        <Box>{t('enter-openAI-key')}</Box>
        <StyledTextField
          fullWidth
          autoFocus
          label={t('open-AI-key')}
          variant="outlined"
          value={key}
          inputProps={{ spellCheck: false }}
          onChange={(ev) => {
            setKey(ev.target.value)
          }}
        />
        <Box>
          <Trans
            i18nKey="AI-assistant-find-your-key"
            components={{
              link1: (
                <Link
                  target="_blank"
                  href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key"
                >
                  here
                </Link>
              ),
              link2: (
                <Link target="_blank" href="https://openai.com/policies/">
                  here
                </Link>
              ),
            }}
          />
        </Box>
      </Stack>
    </StepDialog>
  )
}

function PromptStepDialog() {
  const [prompt, setPrompt] = React.useState(DEFAULT_PROMPT)

  return (
    <StepDialog
      label={t('confirm')}
      cancelLabel={t('cancel')}
      confirmDisabled={!prompt}
      transitionDuration={0}
      onConfirm={() => store.setPromptAndFetchResult({ prompt })}
    >
      <Stack spacing={1}>
        <Box>{t('AI-assistant-enter-prompt')}</Box>
        <StyledTextField
          autoFocus
          value={prompt}
          label="Prompt"
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
      label={t('ok')}
      disabled={state.progress?.blocking}
      transitionDuration={{ enter: 0 }}
      onConfirm={store.closeDialog}
    >
      {state.result && <Markdown>{state.result}</Markdown>}
      <LinearProgress progress={state.progress} />
    </StepDialog>
  )
}

function StepDialog(
  props: PropsWithChildren<{
    label: string
    onConfirm: () => void
    cancelLabel?: string
    disabled?: boolean
    confirmDisabled?: boolean
    transitionDuration?: number | { enter?: number; exit?: number }
  }>
) {
  return (
    <TwoButtonDialog
      open={true}
      maxWidth="md"
      title={t('AI-assistant')}
      Icon={AutoFixHighIcon}
      label={props.label}
      disabled={props.disabled}
      confirmDisabled={props.confirmDisabled}
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
