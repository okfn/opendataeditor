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
  label: string
  paths: string[]
  values?: { label: string; value: any }[]
}

export class Preset<Options extends IPresetOptions> {
  static source: any
  static target: ITarget
  options: Options

  constructor(options: Options) {
    this.options = options
  }

  toVegaLite() {
    const chart = cloneDeep((this.constructor as typeof Preset).source)
    chart.data = this.options.data
    for (const option of (this.constructor as typeof Preset).target.options) {
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
