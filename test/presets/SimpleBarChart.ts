import Preset from '../../src/libraries/vega-presets/presets/SimpleBarChart'

describe('General', () => {
  test('default', () => {
    const preset = new Preset({ x: 'field1', y: 'field2', data: { url: 'data.csv' } })
    const spec = preset.toVegaLite()
    expect(spec.encoding.x.field).toEqual('field1')
    expect(spec.encoding.y.field).toEqual('field2')
    expect(spec.data.url).toEqual('data.csv')
  })
})
