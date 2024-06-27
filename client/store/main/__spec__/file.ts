import { describe, expect, test, beforeEach } from 'vitest'
import { closeFile } from '../file'
import * as store from '../../store'

// Put tests here; for example like this

describe('file', () => {
  beforeEach(store.resetState)

  test('closeFile', async () => {
    store.setState('set-measure', (state) => {
      state.main.measure = { errors: 3 }
    })

    closeFile()

    const { measure } = store.getState().main
    expect(measure).toEqual(undefined)
  })
})
