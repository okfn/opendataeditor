import { Group } from './group'
import { Preset } from './preset'

// Groups

import barCharts from './groups/barCharts'
import lineCharts from './groups/lineCharts'

// Presets

import lineChart from './presets/lineChart'
import simpleBarChart from './presets/simpleBarChart'

// State

const groups: Group[] = [barCharts, lineCharts]
const presets: Preset[] = [lineChart, simpleBarChart]

// Logic

function getPreset(type: string) {
  for (const preset of presets) {
    if (preset.config.type === type) return preset
  }
  return undefined
}

export default { groups, presets, getPreset }
