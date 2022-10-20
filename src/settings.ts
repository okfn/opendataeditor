// Genearl

export const PACKAGE_PATH = 'datapackage.json'
export const FORMATS = ['csv', 'xlsx']
export const HASHINGS = ['md5', 'sha256']
export const ENCODINGS = ['utf-8', 'iso-8859-1']
export const MISSING_VALUES = ['""', 'n/a', 'na', 'N/A', 'NA']
export const TRUE_VALUES = ['true', 'TRUE', 'yes', 'YES', '1']
export const FALSE_VALUES = ['false', 'FALSE', 'no', 'NO', '0']
export const METADATA_FORMATS = ['json', 'yaml']

// Defaults

export const DEFAULT_PORT = 4040
export const DEFAULT_EXPORT_FORMAT = 'yaml'
export const DEFAULT_FIELD_CONFIDENCE = 0.9
export const DEFAULT_MISSING_VALUES = ['""']
export const DEFAULT_HEADER = true
export const DEFAULT_HEADER_JOIN = ' '
export const DEFAULT_HEADER_CASE = true
export const DEFAULT_DECIMAL_CHAR = '.'
export const DEFAULT_GROUP_CHAR = ','
export const DEFAULT_BARE_NUMBER = true
export const DEFAULT_DELIMITER = ','
export const DEFAULT_LINE_TERMINATOR = '\\r\\n'
export const DEFAULT_QUOTE_CHAR = '"'
export const DEFAULT_DOUBLE_QUOTE = true
export const DEFAULT_ESCAPE_CHAR = undefined
export const DEFAULT_NULL_SEQUENCE = undefined
export const DEFAULT_SKIP_INITIAL_SPACE = false
export const DEFAULT_COMMENT_CHAR = undefined
export const DEFUALT_BUTTON_VARIANT = 'outlined'
export const DEFUALT_PRIMARY_BUTTON_VARIANT = 'contained'

// Structures
// TODO: move to components?

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

export const CHECKS = [
  'duplicate-row',
  'deviated-value',
  'truncated-value',
  'forbidden-value',
  'sequential-value',
  'row-constraint',
  'table-dimensions',
]

export const STEPS = [
  'field-add',
  'field-filter',
  'field-move',
  'field-remove',
  'field-split',
  'field-unpack',
  'field-update',
]
