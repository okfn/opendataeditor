import Field from './Elements/Field'
import Fields from './Elements/Fields'
import ForeignKey from './Elements/ForeignKey'
import ForeignKeys from './Elements/ForeignKeys'

// TODO: don't use caps?

export const MISSING_VALUES = ['""', 'n/a', 'na', 'N/A', 'NA']
export const TRUE_VALUES = ['true', 'TRUE', 'yes', 'YES', '1']
export const FALSE_VALUES = ['false', 'FALSE', 'no', 'NO', '0']
export const DEFAULT_DECIMAL_CHAR = '.'
export const DEFAULT_GROUP_CHAR = ','
export const DEFAULT_BARE_NUMBER = true
export const ELEMENTS = {
  field: {
    title: 'Field',
    element: Field,
    listing: Fields,
  },
  foreignKey: {
    title: 'Foreign Key',
    element: ForeignKey,
    listing: ForeignKeys,
  },
}
export const FIELDS = {
  any: {
    formats: ['default'],
    constraints: ['required', 'enum'],
  },
  array: {
    formats: ['default'],
    constraints: ['required', 'minLength', 'maxLength', 'pattern', 'enum'],
  },
  boolean: {
    formats: ['default'],
    constraints: ['required', 'enum'],
  },
  date: {
    formats: ['default', '*'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
  },
  datetime: {
    formats: ['default', '*'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
  },
  duration: {
    formats: ['default'],
    constraints: ['required', 'enum'],
  },
  geojson: {
    formats: ['default'],
    constraints: ['required', 'enum'],
  },
  geopoint: {
    formats: ['default'],
    constraints: ['required', 'enum'],
  },
  integer: {
    formats: ['default'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
  },
  number: {
    formats: ['default'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
  },
  string: {
    formats: ['default', 'email', 'uri', 'binary', 'uuid'],
    constraints: ['required', 'minLength', 'maxLength', 'pattern', 'enum'],
  },
  object: {
    formats: ['default'],
    constraints: ['required', 'minLength', 'maxLength', 'enum'],
    extraProperties: [],
  },
  time: {
    formats: ['default', '*'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
    extraProperties: [],
  },
  year: {
    formats: ['default'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
  },
  yearmonth: {
    formats: ['default'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
  },
}
