import * as preset from '../preset'

export interface ChartConfig extends preset.ChartConfig {
  x: string
  y: string
}

export default new preset.Preset<ChartConfig>({
  type: 'simple-bar-chart',
  group: 'bar',
  title: 'Simple Bar Chart',
  image: 'https://github.com/vega/vega-lite/raw/main/examples/compiled/bar.png',
  source: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    mark: 'bar',
    encoding: {
      x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
      y: { field: 'b', type: 'quantitative' },
    },
  },
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
})
