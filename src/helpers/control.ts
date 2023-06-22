import * as types from '../types'

export function ensureControl(control: Partial<types.IControl> = {}) {
  if (control.type === 'ckan') {
    if (!control.dataset) return
    if (!control.baseurl) return
    if (!control.apikey) return
    return control as types.IControl
  }
  return undefined
}
