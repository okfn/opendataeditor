import preset from '../../src/libraries/vega-presets/presets/simpleBarChart'

describe('General', () => {
  test('default', () => {
    const spec = preset.toVegaLite({
      x: 'field1',
      y: 'field2',
      data: { url: 'data.csv' },
    })
    expect(spec.encoding.x.field).toEqual('field1')
    expect(spec.encoding.y.field).toEqual('field2')
    expect(spec.data.url).toEqual('data.csv')
  })
})
