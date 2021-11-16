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
    const buffer = await file.arrayBuffer()
    const body = new FormData()
    body.append('file', new Blob([buffer]), file.name)

    // TODO: move to a proper place
    // Describe
    const response1 = await fetch('http://localhost:7070/api/describe', {
      method: 'POST',
      body: body,
    })
    const data1 = await response1.json()
    const resource = data1.resource

    // TODO: move to a proper place
    // Extract
    const response2 = await fetch('http://localhost:7070/api/extract', {
      method: 'POST',
      body: body,
    })
    const data2 = await response2.json()
    const rows = data2.rows

    const { report } = await validate(file, resource)
    const { status, targetRows } = await transform(file, resource)
    console.log(report)

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
async function validate(file: File, resource: any) {
  const body = new FormData()
  const buffer = await file.arrayBuffer()
  const inquiry = { tasks: [{ source: resource }] }
  body.append('file', new Blob([buffer]), file.name)
  body.append('inquiry', JSON.stringify(inquiry))
  const response = await fetch('http://localhost:7070/api/validate', {
    method: 'POST',
    body: body,
  })
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
  const response = await fetch('http://localhost:7070/api/transform', {
    method: 'POST',
    body: body,
  })
  return response.json()
}
