import { describe, expect, test, beforeEach } from 'vitest'
import { deselectFile } from '../file'
import * as store from '../../store'

// Put tests here; for example like this

describe('file', () => {
  beforeEach(store.resetState)

  test.skip('closeFile', async () => {
    store.setState('set-measure', (state) => {
      state.path = 'table.csv'
      state.measure = { errors: 3 }
    })

    deselectFile()

    const { measure } = store.getState()
    expect(measure).toEqual(undefined)
  })
})
