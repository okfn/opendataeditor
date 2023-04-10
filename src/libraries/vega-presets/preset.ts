import jsonpath from 'jsonpath'
import cloneDeep from 'lodash/cloneDeep'

export interface PresetConfig {
  type: string
  group: string
  title: string
  image: string
  source: any
  options: {
    name: string
    type: string
    label: string
    paths: string[]
    values?: { label: string; value: any }[]
  }[]
}

export interface ChartConfig {
  data: object
}

export class Preset<Options extends ChartConfig = ChartConfig> {
  constructor(public config: PresetConfig) {}

  toVegaLite(options: Options) {
    const chart = cloneDeep(this.config.source)
    chart.data = options.data
    for (const option of this.config.options) {
      for (const path of option.paths) {
        jsonpath.apply(chart, path, () => {
          // @ts-ignore
          return this.options[option.name]
        })
      }
    }
    return chart
  }
}
