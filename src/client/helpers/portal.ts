import * as types from '../types'

export function makeControl(portal: types.IPortal) {
  if (portal.type === 'ckan') {
    const control: Partial<types.ICkanControl> = portal.ckan || {}
    control.type = 'ckan'
    if (!control.baseurl) return
    if (!control.dataset) return
    if (!control.apikey) return
    return control as types.ICkanControl
  }
  if (portal.type === 'github') {
    const control: Partial<types.IGithubControl> = portal.github || {}
    control.type = 'github'
    if (!control.user) return
    if (!control.repo) return
    if (!control.apikey) return
    return control as types.IGithubControl
  }
  if (portal.type === 'zenodo') {
    const control: Partial<types.IZenodoControl> = portal.zenodo || {}
    control.type = 'zenodo'
    if (!control.apikey) return
    return control as types.IZenodoControl
  }
  return undefined
}
