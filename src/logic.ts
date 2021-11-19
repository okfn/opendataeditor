import { client } from './client'

export const initialState = {
  file: null,
  resource: null,
  text: null,
  rows: null,
  report: null,
  page: 'home',
  detector: { bufferSize: 10000, sampleSize: 100 },
  pipeline: null,
}

// TODO: remove any
export async function reducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_PAGE':
      return setPage(state, action)
    case 'UPDATE_RESOURCE':
      return updateResource(state, action)
    case 'UPDATE_DETECTOR':
      return updateDetector(state, action)
    case 'UPDATE_PIPELINE':
      return updatePipeline(state, action)
    case 'UPLOAD_FILE':
      return uploadFile(state, action)
    default:
      return state
  }
}

async function setPage(state: any, action: any) {
  let patch = {}
  if (action.page === 'extract') {
    patch = await client.extract(state.file, state.resource)
  } else if (action.page === 'validate') {
    patch = await client.validate(state.file, state.resource)
  } else if (action.page === 'transform') {
    patch = await client.transform(state.file, state.resource, state.pipeline)
  }
  return { ...state, page: action.page, ...patch }
}

function updateResource(state: any, action: any) {
  if (!state.resource) return state
  let { resource } = state
  resource = { ...resource, ...action.update }
  return { ...state, resource }
}

function updatePipeline(state: any, action: any) {
  return { ...state, pipeline: action.pipeline }
}

function updateDetector(state: any, action: any) {
  let { detector } = state
  detector = { ...detector, ...action.detector }
  return { ...state, detector }
}

async function uploadFile(state: any, action: any) {
  const { files } = action
  if (files.length) {
    const file = files[0]
    if (file.type !== 'text/csv' || file.size > 10000000) {
      // TODO: clean file input
      alert('Currently only CSV files under 10Mb are supported')
      return state
    }
    // TODO: implement properly
    const text = await file.text()
    const patch = await client.describe(file)
    return { ...state, file, text, page: 'describe', ...patch }
  }
  return state
}
