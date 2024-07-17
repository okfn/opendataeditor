import * as store from '../store'
import { client } from '@client/client'
import { onFileCreated } from './file'

export async function createArticle(props: { path: string; prompt?: string }) {
  const result = await client.articleCreate({ ...props, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-article-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function createChart(props: { path: string; prompt?: string }) {
  const result = await client.chartCreate({ ...props, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-chart-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function createFile(props: { path: string; prompt?: string }) {
  if (props.prompt) {
    const text = ''
    const result = await client.textCreate({ ...props, text, deduplicate: true })

    if (result instanceof client.Error) {
      return store.setState('create-file-error', (state) => {
        state.error = result
      })
    }

    await onFileCreated([result.path])
  } else {
    const file = new File([new Blob()], props.path)
    const result = await client.fileCreate({ path: props.path, file, deduplicate: true })

    if (result instanceof client.Error) {
      return store.setState('create-file-error', (state) => {
        state.error = result
      })
    }

    await onFileCreated([result.path])
  }
}

export async function createImage(props: { path: string; prompt?: string }) {
  const result = await client.imageCreate({ ...props, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-image-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function createMap(props: { path: string; prompt?: string }) {
  const result = await client.mapCreate({ ...props, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-map-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function createPackage(props: { path: string; prompt?: string }) {
  const result = await client.packageCreate({ ...props, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-package-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function createScript(props: { path: string; prompt?: string }) {
  const result = await client.scriptCreate({ ...props, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-script-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function createTable(props: { path: string; prompt?: string }) {
  const result = await client.textCreate({ ...props, text: '', deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-table-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}

export async function createView(props: { path: string; prompt?: string }) {
  const result = await client.viewCreate({ ...props, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-view-error', (state) => {
      state.error = result
    })
  }

  await onFileCreated([result.path])
}
