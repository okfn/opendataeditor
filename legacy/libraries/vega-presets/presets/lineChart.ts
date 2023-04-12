import * as preset from '../preset'

export interface ChartConfig extends preset.ChartConfig {
  x: string
  y: string
}

export default new preset.Preset<ChartConfig>({
  type: 'line-chart',
  group: 'line',
  title: 'Line Chart',
  image: 'https://github.com/vega/vega-lite/raw/main/examples/compiled/line.png',
  source: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    mark: 'line',
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'price', type: 'quantitative' },
    },
  },
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
})
