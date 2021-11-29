import Field from './Elements/Field'
import Fields from './Elements/Fields'
import ForeignKey from './Elements/ForeignKey'
import ForeignKeys from './Elements/ForeignKeys'

export const MISSING_VALUES = ['""', 'n/a', 'na', 'N/A', 'NA']
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
    properties: [],
  },
  array: {
    formats: ['default'],
    constraints: ['required', 'minLength', 'maxLength', 'pattern', 'enum'],
    properties: ['arrayItem'],
  },
  boolean: {
    formats: ['default'],
    constraints: ['required', 'enum'],
    properties: ['trueValues', 'falseValues'],
  },
  date: {
    formats: ['default', '*'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
    properties: [],
  },
  datetime: {
    formats: ['default', '*'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
    properties: [],
  },
  duration: {
    formats: ['default'],
    constraints: ['required', 'enum'],
    properties: [],
  },
  geojson: {
    formats: ['default'],
    constraints: ['required', 'enum'],
    properties: [],
  },
  geopoint: {
    formats: ['default'],
    constraints: ['required', 'enum'],
    properties: [],
  },
  integer: {
    formats: ['default'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
    properties: ['bareNumber', 'groupChar'],
  },
  number: {
    formats: ['default'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
    properties: ['bareNumber', 'floatNumber', 'decimalChar', 'groupChar'],
  },
  string: {
    formats: ['default', 'email', 'uri', 'binary', 'uuid'],
    constraints: ['required', 'minLength', 'maxLength', 'pattern', 'enum'],
    properties: [],
  },
  object: {
    formats: ['default'],
    constraints: ['required', 'minLength', 'maxLength', 'enum'],
    properties: [],
  },
  time: {
    formats: ['default', '*'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
    properties: [],
  },
  year: {
    formats: ['default'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
    properties: [],
  },
  yearmonth: {
    formats: ['default'],
    constraints: ['required', 'minimum', 'maximum', 'enum'],
    properties: [],
  },
}
