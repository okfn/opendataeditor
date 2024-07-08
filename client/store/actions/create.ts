import * as store from '../store'
import { client } from '@client/client'
import { onFileCreate } from './event'

export async function createArticle(path: string, prompt?: string) {
  const result = await client.articleCreate({ path, prompt, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-article-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function createChart(path: string, prompt?: string) {
  const result = await client.chartCreate({ path, prompt, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-chart-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function createImage(path: string, prompt?: string) {
  const result = await client.imageCreate({ path, prompt, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-image-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function createMap(path: string, prompt?: string) {
  const result = await client.mapCreate({ path, prompt, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-map-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function createPackage(path: string, prompt?: string) {
  const result = await client.packageCreate({ path, prompt, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-package-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function createScript(path: string, prompt?: string) {
  const result = await client.scriptCreate({ path, prompt, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-script-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function createTable(path: string, prompt?: string) {
  const result = await client.textCreate({
    path,
    text: '',
    prompt,
    deduplicate: true,
  })

  if (result instanceof client.Error) {
    return store.setState('create-table-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}

export async function createView(path: string, prompt?: string) {
  const result = await client.viewCreate({ path, prompt, deduplicate: true })

  if (result instanceof client.Error) {
    return store.setState('create-view-error', (state) => {
      state.error = result
    })
  }

  onFileCreate([result.path])
}
