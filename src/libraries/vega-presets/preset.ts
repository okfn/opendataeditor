import jsonpath from 'jsonpath'
import cloneDeep from 'lodash/cloneDeep'

export interface PresetProps {
  data: object
}

export interface ITarget {
  fields: ITargetField[]
}

export interface ITargetField {
  name: string
  type: string
  paths: string[]
}

export abstract class Preset<Props extends PresetProps> {
  abstract source: any
  abstract target: ITarget
  props: Props

  constructor(props: Props) {
    this.props = props
  }

  toVegaLite() {
    const chart = cloneDeep(this.source)
    chart.data = this.props.data
    for (const field of this.target.fields) {
      for (const path of field.paths) {
        jsonpath.apply(chart, path, () => {
          // @ts-ignore
          return this.props[field.name]
        })
      }
    }
    return chart
  }
}
