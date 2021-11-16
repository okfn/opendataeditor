import cloneDeep from 'lodash/cloneDeep'

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
    patch = await extract(state.file, state.resource)
  } else if (action.page === 'validate') {
    patch = await validate(state.file, state.resource)
  } else if (action.page === 'transform') {
    patch = await transform(state.file, state.resource, state.pipeline)
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
    const patch = await describe(file)
    return { ...state, file, text, page: 'describe', ...patch }
  }
  return state
}

// TODO: move to a proper place
async function describe(file: File) {
  const body = new FormData()
  const buffer = await file.arrayBuffer()
  body.append('file', new Blob([buffer]), file.name)
  const payload = { method: 'POST', body: body }
  const response = await fetch('http://localhost:7070/api/describe', payload)
  return await response.json()
}

// TODO: move to a proper place
async function extract(file: File, resource: any) {
  const body = new FormData()
  const buffer = await file.arrayBuffer()
  body.append('file', new Blob([buffer]), file.name)
  body.append('resource', JSON.stringify(resource))
  const payload = { method: 'POST', body: body }
  const response = await fetch('http://localhost:7070/api/extract', payload)
  return response.json()
}

// TODO: move to a proper place
async function validate(file: File, resource: any) {
  const body = new FormData()
  const buffer = await file.arrayBuffer()
  const inquiry = { tasks: [{ source: resource }] }
  body.append('file', new Blob([buffer]), file.name)
  body.append('inquiry', JSON.stringify(inquiry))
  const payload = { method: 'POST', body: body }
  const response = await fetch('http://localhost:7070/api/validate', payload)
  return response.json()
}

// TODO: move to a proper place
async function transform(file: File, resource: any, pipeline: any) {
  const body = new FormData()
  const buffer = await file.arrayBuffer()
  if (pipeline) {
    pipeline = cloneDeep(pipeline)
    pipeline.tasks[0].type = 'resource'
    pipeline.tasks[0].source = resource
    for (const step of pipeline.tasks[0].steps) {
      if (!step.descriptor) continue
      const descriptor = JSON.parse(step.descriptor)
      for (const [key, value] of Object.entries(descriptor)) {
        step[key] = value
      }
    }
  } else {
    pipeline = {
      tasks: [
        {
          type: 'resource',
          source: resource,
          steps: [{ code: 'table-normalize' }],
        },
      ],
    }
  }
  console.log(pipeline)
  body.append('file', new Blob([buffer]), file.name)
  body.append('pipeline', JSON.stringify(pipeline))
  const payload = { method: 'POST', body: body }
  const response = await fetch('http://localhost:7070/api/transform', payload)
  return response.json()
}
