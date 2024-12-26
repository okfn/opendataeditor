import type { formats } from './constants'

export type IFormat = (typeof formats)[number]['name']
