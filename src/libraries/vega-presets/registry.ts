// Groups
import BarCharts from './groups/BarCharts'
import LineCharts from './groups/LineCharts'
// Presets
import LineChart from './presets/LineChart'
import SimpleBarChart from './presets/SimpleBarChart'

export class Registry {
  static listGroups() {
    return [BarCharts, LineCharts]
  }

  static listPresets() {
    return [LineChart, SimpleBarChart]
  }

  static listPresetsInGroup(type: string) {
    return this.listPresets().map((Preset) => Preset.group === type)
  }

  static getPreset(type: string) {
    for (const Preset of this.listPresets()) {
      if (Preset.type === type) return Preset
    }
    return undefined
  }
}
