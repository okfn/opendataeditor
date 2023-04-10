import * as preset from '../preset'

export interface IPresetOptions extends preset.IPresetOptions {
  x: string
  y: string
}

export default class Preset extends preset.Preset<IPresetOptions> {
  static type = 'simple-bar-chart'
  static title = 'Simple Bar Chart'
  static image = 'https://github.com/vega/vega-lite/raw/main/examples/compiled/bar.png'
  static source = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: [
        { a: 'A', b: 28 },
        { a: 'B', b: 55 },
        { a: 'C', b: 43 },
        { a: 'D', b: 91 },
        { a: 'E', b: 81 },
        { a: 'F', b: 53 },
        { a: 'G', b: 19 },
        { a: 'H', b: 87 },
        { a: 'I', b: 52 },
      ],
    },
    mark: 'bar',
    encoding: {
      x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
      y: { field: 'b', type: 'quantitative' },
    },
  }

  static target = {
    options: [
      {
        name: 'x',
        type: 'string',
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
