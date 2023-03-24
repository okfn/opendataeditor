import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Columns from '../../../Parts/Columns'
import InputField from '../../../Parts/Fields/InputField'
import { IPublish } from '../../../../interfaces/publish'
import UserInfo from '../../../Parts/UserInfo'
import LinearProgress from '@mui/material/LinearProgress'

interface GithubControlParams extends IPublish {
  repo?: string
  email?: string
  user?: string
}

interface GithubProps {
  responseMessage?: any
  publish: (params: GithubControlParams) => any
  onCancelPublish: () => void
  onComplete: (response: any) => void
}

export default function Github(props: GithubProps) {
  const [disabled, setDisabled] = React.useState<boolean>(true)
  const [isURLSet, setIsURLSet] = React.useState<boolean>(true)
  const [isWaiting, setIsWaiting] = React.useState<boolean>(false)
  // Form variables
  const [params, setParams] = React.useState<
    GithubControlParams & { [key: string]: any }
  >({
    type: 'github',
    url: '',
    apikey: '',
    repo: '',
    email: '',
    user: '',
    sandbox: false,
    allow_update: false,
  })
  const [rules, _] = React.useState<{ [key: string]: any }>({
    apikey: { required: true, message: 'API Key is required' },
    email: { required: true, message: 'Email is required' },
  })

  // Hook
  React.useEffect(() => {
    validate()
  }, [params])

  // Helper functions
  const isEmpty = (value: any) => {
    value = value.trim()
    return value === '' || value === undefined
  }
  const isValid = (param: string) => {
    if (rules[param] && rules[param].required && isEmpty(params[param])) {
      return false
    }
    return true
  }
  const validate = () => {
    let _disabled = false
    for (const param in params) {
      if (rules[param] && rules[param].required && isEmpty(params[param])) {
        _disabled = true
      }
    }

    // if url is not set, check if repo or username is set
    let _isURLSet = !isEmpty(params.url)
    if (!_isURLSet) {
      _isURLSet = !isEmpty(params.repo) && !isEmpty(params.user)
    }
    setIsURLSet(_isURLSet)

    if (!_isURLSet) {
      _disabled = true
    }
    setDisabled(_disabled)
  }

  // Event Handlers
  const handleChange = (names: Array<string>, values: Array<any>) => {
    const updatedParams = { ...params }
    for (const index in names) {
      updatedParams[names[index]] = values[index]
    }
    setParams(updatedParams)
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const paramsJSON = JSON.parse(JSON.stringify(params))
    for (const param in paramsJSON) {
      if (paramsJSON[param] === '') {
        delete paramsJSON[param]
      }
    }

    const hasURL = paramsJSON.url && !isEmpty(paramsJSON.url)
    if (hasURL) {
      delete paramsJSON.repo
      delete paramsJSON.user
    }

    setIsWaiting(true)
    setDisabled(true)
    // Wait for variable to be set
    setTimeout(() => {
      props
        .publish(paramsJSON)
        .then((response: any) => {
          const responseObj = JSON.parse(response)
          if (responseObj.url) {
            setIsWaiting(false)
            setDisabled(false)
            const response = {
              type: 'success',
              message: `Successfully published to "https://github.com/${responseObj.url}"`,
            }
            props.onComplete(response)
          } else if (responseObj.error) {
            setIsWaiting(false)
            setDisabled(false)
            const response = {
              type: 'error',
              message: `Error publishing package. "${responseObj.error.message}"`,
            }
            props.onComplete(response)
          }
        })
        .catch(console.error)
    }, 1000)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box marginTop="0px">Github</Box>
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <InputField
            required
            label="Github API Key"
            helperText={!isValid('apikey') ? rules.apikey.message : ''}
            error={!isValid('apikey')}
            value={params.apikey}
            onChange={(value) => handleChange(['apikey'], [value])}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            label="Repo URL"
            error={!isURLSet}
            value={params.url}
            onChange={(value) => handleChange(['url'], [value])}
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          or
        </Grid>
        <Grid item xs={6}>
          <InputField
            label="Repository Name"
            error={!isURLSet}
            value={params.repo}
            onChange={(value) => handleChange(['repo'], [value])}
          />
        </Grid>
        <Grid item xs={6}>
          <InputField
            label="Username"
            error={!isURLSet}
            value={params.user}
            onChange={(value) => handleChange(['user'], [value])}
          />
        </Grid>
        <Grid item xs={12}>
          {!isURLSet && (
            <UserInfo
              message="Either URL or (Repo name/ User) is required!"
              type="error"
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <InputField
            required
            label="Email"
            helperText={!isValid('email') ? rules.email.message : ''}
            error={!isValid('email')}
            value={params.email}
            onChange={(value) => handleChange(['email'], [value])}
          />
        </Grid>
        <Grid item xs={12}>
          {props.responseMessage && (
            <UserInfo
              message={props.responseMessage.message}
              type={props.responseMessage.type}
              showIcon={true}
            />
          )}
          {isWaiting && (
            <Box>
              Publishing
              <LinearProgress />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} sx={{ pt: 2 }}>
          <Columns spacing={2}>
            <Button
              fullWidth
              disabled={disabled}
              type="submit"
              variant="contained"
              size="small"
              aria-label="publish selected right"
              color="secondary"
            >
              Publish
            </Button>
            <Button
              fullWidth
              onClick={props.onCancelPublish}
              variant="contained"
              size="small"
              aria-label="cancel selected right"
              color="warning"
            >
              Cancel
            </Button>
          </Columns>
        </Grid>
      </Grid>
    </Box>
  )
}