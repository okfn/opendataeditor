import { describe, expect, test, beforeEach } from 'vitest'
import { deselectFile } from '../file'
import * as store from '../../store'

// Put tests here; for example like this

describe('file', () => {
  beforeEach(store.resetState)

  test.skip('closeFile', async () => {
    store.setState('set-path', (state) => {
      state.path = 'table.csv'
    })

    deselectFile()

    const { path } = store.getState()
    expect(path).toEqual(undefined)
  })
})
