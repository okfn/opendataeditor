import { Preset } from './preset'

export interface GroupConfig {
  type: string
  title: string
  presets: Preset[]
}

export class Group {
  constructor(public config: GroupConfig) {}
}
