import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Columns from '../../../Library/Columns'
import UserInfo from '../../../Library/UserInfo'
import HeadingBox from '../../../Library/Groups/HeadingBox'
import InputField from '../../../Library/Fields/InputField'
import { IPublish } from '../../../../interfaces/publish'
import { LinearProgress } from '@mui/material'

interface CKANControlParams extends IPublish {
  baseURL?: string
  allowUpdate?: boolean
}

interface CKANProps {
  responseMessage?: any
  publish: (params: CKANControlParams) => any
  onCancelPublish: () => void
  onComplete: (response: any) => void
}

export default function CKAN(props: CKANProps) {
  const [disabled, setDisabled] = React.useState<boolean>(true)
  const [isWaiting, setIsWaiting] = React.useState<boolean>(false)
  // Form variables
  const [params, setParams] = React.useState<CKANControlParams & { [key: string]: any }>({
    type: 'ckan',
    apikey: '',
    baseURL: '',
    sandbox: false,
    allowUpdate: false,
  })
  const [rules, _] = React.useState<{ [key: string]: any }>({
    apikey: { required: true, message: 'API Key is required.' },
    baseURL: { message: 'Base URL is required for Sandbox mode.' },
  })

  // Hooks
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

    // Rename baseURL to base_url to map zenodo control params
    paramsJSON.baseurl = paramsJSON.baseURL
    paramsJSON.allow_update = paramsJSON.allowUpdate

    // Remove extra params before sending to server
    delete paramsJSON.baseURL
    delete paramsJSON.allowUpdate

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
              message: `Successfully published to "${responseObj.url}"`,
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
      <HeadingBox>CKAN</HeadingBox>
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <InputField
            required
            label="CKAN API Key"
            helperText={!isValid('apikey') ? rules.apikey.message : ''}
            error={!isValid('apikey')}
            value={params.apikey}
            onChange={(value) => handleChange(['apikey'], [value])}
          />
        </Grid>
        <Grid item xs={12}>
          <InputField
            label="Base URL"
            helperText={!isValid('baseURL') ? rules.baseURL.message : ''}
            error={params.sandbox && params.baseURL === ''}
            value={params.baseURL}
            onChange={(value) => handleChange(['baseURL'], [value])}
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
