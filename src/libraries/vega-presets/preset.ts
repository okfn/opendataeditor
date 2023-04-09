import jsonpath from 'jsonpath'
import cloneDeep from 'lodash/cloneDeep'

export interface IPresetOptions {
  data: object
}

export interface ITarget {
  options: ITargetOption[]
}

export interface ITargetOption {
  name: string
  type: string
  paths: string[]
}

export abstract class Preset<Options extends IPresetOptions> {
  abstract source: any
  abstract target: ITarget
  options: Options

  constructor(options: Options) {
    this.options = options
  }

  toVegaLite() {
    const chart = cloneDeep(this.source)
    chart.data = this.options.data
    for (const option of this.target.options) {
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
