import * as preset from '../preset'

export interface IPresetOptions extends preset.IPresetOptions {
  x: string
  y: string
}

export default class Preset extends preset.Preset<IPresetOptions> {
  static type = 'line-chart'
  static group = 'line'
  static title = 'Line Chart'
  static image = 'https://github.com/vega/vega-lite/raw/main/examples/compiled/line.png'
  static source = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    mark: 'line',
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'price', type: 'quantitative' },
    },
  }

  static target = {
    options: [
      {
        name: 'x',
        type: 'datetime',
        label: 'Field X',
        paths: ['$.encoding.x.field'],
      },
      {
        name: 'y',
        type: 'number',
        label: 'Field Y',
        paths: ['$.encoding.y.field'],
      },
    ],
  }
}
