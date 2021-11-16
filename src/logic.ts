export const initialState = {
  file: null,
  resource: null,
  text: null,
  rows: null,
  report: null,
  page: 'home',
  detector: { bufferSize: 10000, sampleSize: 100 },
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
    case 'UPLOAD_FILE':
      return uploadFile(state, action)
    default:
      return state
  }
}

function setPage(state: any, action: any) {
  return { ...state, page: action.page }
}

function updateResource(state: any, action: any) {
  if (!state.resource) return state
  let { resource } = state
  resource = { ...resource, ...action.update }
  return { ...state, resource }
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
    const { resource } = await describe(file)
    const { rows } = await extract(file, resource)
    const { report } = await validate(file, resource)
    const { status, targetRows } = await transform(file, resource)

    return {
      ...state,
      file,
      resource,
      text,
      rows,
      report,
      page: 'describe',
      status,
      targetRows,
    }
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
async function transform(file: File, resource: any) {
  const body = new FormData()
  const buffer = await file.arrayBuffer()
  const pipeline = {
    tasks: [
      {
        type: 'resource',
        source: resource,
        steps: [{ code: 'table-normalize' }],
      },
    ],
  }
  body.append('file', new Blob([buffer]), file.name)
  body.append('pipeline', JSON.stringify(pipeline))
  const payload = { method: 'POST', body: body }
  const response = await fetch('http://localhost:7070/api/transform', payload)
  return response.json()
}
